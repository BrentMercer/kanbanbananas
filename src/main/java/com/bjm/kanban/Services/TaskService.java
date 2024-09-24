package com.bjm.kanban.Services;

import com.bjm.kanban.DTO.TaskDTO;
import com.bjm.kanban.Entities.Column;
import com.bjm.kanban.Entities.Task;
import com.bjm.kanban.Repository.ColumnRepository;
import com.bjm.kanban.Repository.TaskRepository;
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
        task.setColumn(column);

        return taskRepository.save(task);
    }

    public Task updateTask(Long id, TaskDTO taskDTO) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        task.setTitle(taskDTO.getTitle());
        task.setDetails(taskDTO.getDetails());
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        taskRepository.delete(task);
    }

    public Task addTaskToColumn(Long columnId, Task task) {
        Column column = columnRepository.findById(columnId).orElseThrow(() -> new ResourceNotFoundException("Column not found"));
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
}

