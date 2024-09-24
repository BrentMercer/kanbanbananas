package com.bjm.kanban.Controller;

import com.bjm.kanban.DTO.TaskDTO;
import com.bjm.kanban.Entities.Task;
import com.bjm.kanban.Services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id) {
        TaskDTO task = taskService.getTaskById(id);
        return task != null ? new ResponseEntity<>(task, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody TaskDTO taskDTO) {
        Task createdTask = taskService.createTask(taskDTO);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody TaskDTO taskDTO) {
        Task updatedTask = taskService.updateTask(id, taskDTO);
        return updatedTask != null ? new ResponseEntity<>(updatedTask, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{columnId}/tasks")
    public ResponseEntity<Task> addTaskToColumn(@PathVariable Long columnId, @RequestBody TaskDTO taskDTO) {
        Task task = taskService.createTaskForColumn(columnId, taskDTO);
        return new ResponseEntity<>(task, HttpStatus.CREATED);
    }


//    @PostMapping("/add")
//    public ResponseEntity<Task> addTask(@RequestBody TaskDTO taskDTO) {
//        Task task = taskService.createTask(taskDTO);
//        return new ResponseEntity<>(task, HttpStatus.CREATED);
//    }



}
