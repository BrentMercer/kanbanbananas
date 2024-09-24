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

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Autowired
    private ColumnRepository columnRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public TaskDTO getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        return new TaskDTO(task.getId(), task.getTitle(), task.getDetails(), task.getColumn().getId());
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

    public Task updateTask(Long id, Task taskDetails) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        task.setTitle(taskDetails.getTitle());
        task.setDetails(taskDetails.getDetails());
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        taskRepository.delete(task);
    }
}

