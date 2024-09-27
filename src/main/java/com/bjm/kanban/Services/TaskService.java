package com.bjm.kanban.Services;

import com.bjm.kanban.DTO.TaskDTO;
import com.bjm.kanban.Entities.Column;
import com.bjm.kanban.Entities.Task;
import com.bjm.kanban.Repository.ColumnRepository;
import com.bjm.kanban.Repository.TaskRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private final TaskRepository taskRepository;

    @Autowired
    private ColumnRepository columnRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public TaskDTO getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        return new TaskDTO(task.getId(), task.getTitle(), task.getDetails(), task.getColumn().getId(), task.getOrderIndex());
    }


    public List<TaskDTO> getTasksByColumnId(Long columnId) {
        Column column = columnRepository.findById(columnId)
                .orElseThrow(() -> new ResourceNotFoundException("Column not found"));

        List<Task> tasks = taskRepository.findByColumn(column);
        return tasks.stream()
                .map(task -> new TaskDTO(task.getId(), task.getTitle(), task.getDetails(), task.getColumn().getId(), task.getOrderIndex()))
                .collect(Collectors.toList());
    }


    public Task createTask(TaskDTO taskDTO) {
        Column column = columnRepository.findById(taskDTO.getColumnId())
                .orElseThrow(() -> new ResourceNotFoundException("Column not found"));

        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDetails(taskDTO.getDetails());
        task.setOrderIndex(taskDTO.getOrderIndex());
        task.setColumn(column);

        return taskRepository.save(task);
    }


    public Task updateTask(Long id, TaskDTO taskDTO) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        task.setTitle(taskDTO.getTitle());
        task.setDetails(taskDTO.getDetails());
        
        if (taskDTO.getColumnId() != null && !task.getColumn().getId().equals(taskDTO.getColumnId())) {
            Column newColumn = columnRepository.findById(taskDTO.getColumnId())
                    .orElseThrow(() -> new ResourceNotFoundException("Column not found"));
            task.setColumn(newColumn);
        }

        return taskRepository.save(task);
    }


    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        taskRepository.delete(task);
    }

    public Task addTaskToColumn(Long columnId, Task task) {
        Column column = columnRepository.findById(columnId)
                .orElseThrow(() -> new ResourceNotFoundException("Column not found"));
        task.setColumn(column);
        return taskRepository.save(task);
    }

    public Task createTaskForColumn(Long columnId, TaskDTO taskDTO) {
        Column column = columnRepository.findById(columnId)
                .orElseThrow(() -> new ResourceNotFoundException("Column not found"));

        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDetails(taskDTO.getDetails());
        task.setOrderIndex(taskDTO.getOrderIndex());
        task.setColumn(column);

        return taskRepository.save(task);
    }

    @Transactional
    public Task moveTask(Long taskId, Long newColumnId, int newOrderIndex) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        Column sourceColumn = task.getColumn();
        Column destinationColumn = columnRepository.findById(newColumnId)
                .orElseThrow(() -> new ResourceNotFoundException("Destination column not found"));

        // If task is moving within the same column
        if (sourceColumn.getId().equals(destinationColumn.getId())) {
            List<Task> tasksInSameColumn = taskRepository.findByColumnIdOrderByOrderIndex(sourceColumn.getId());

            // Recalculate orderIndex for all tasks in the same column
            tasksInSameColumn.remove(task);  // Remove the task from its old position
            tasksInSameColumn.add(newOrderIndex, task);  // Add it to its new position

            for (int i = 0; i < tasksInSameColumn.size(); i++) {
                tasksInSameColumn.get(i).setOrderIndex(i);
            }
        } else {
            // If task is moving to a different column
            List<Task> tasksInSourceColumn = taskRepository.findByColumnIdOrderByOrderIndex(sourceColumn.getId());
            List<Task> tasksInDestinationColumn = taskRepository.findByColumnIdOrderByOrderIndex(destinationColumn.getId());

            // Remove the task from the source column and update orderIndex
            tasksInSourceColumn.remove(task);
            for (int i = 0; i < tasksInSourceColumn.size(); i++) {
                tasksInSourceColumn.get(i).setOrderIndex(i);
            }

            // Add the task to the destination column and update orderIndex
            task.setColumn(destinationColumn);
            tasksInDestinationColumn.add(newOrderIndex, task);
            for (int i = 0; i < tasksInDestinationColumn.size(); i++) {
                tasksInDestinationColumn.get(i).setOrderIndex(i);
            }
        }

        // Save changes
        return taskRepository.save(task);
    }

}

