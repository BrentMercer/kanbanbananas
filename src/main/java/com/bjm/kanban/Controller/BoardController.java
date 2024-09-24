package com.bjm.kanban.Controller;

import com.bjm.kanban.Entities.Board;
import com.bjm.kanban.Entities.Column;
import com.bjm.kanban.Entities.Task;
import com.bjm.kanban.Services.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/boards")
public class BoardController {

    @Autowired
    private BoardService boardService;

    // Get a specific board with columns and tasks
    @GetMapping("/{id}")
    public ResponseEntity<Board> getBoardById(@PathVariable Long id) {
        Board board = boardService.getBoardWithColumnsAndTasks(id);
        if (board != null) {
            return new ResponseEntity<>(board, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Add a new column to a board
    @PostMapping("/{boardId}/columns")
    public ResponseEntity<Column> addColumnToBoard(@PathVariable Long boardId, @RequestBody Column column) {
        Column createdColumn = boardService.addColumnToBoard(boardId, column);
        return new ResponseEntity<>(createdColumn, HttpStatus.CREATED);
    }

    // Update a column
    @PutMapping("/columns/{columnId}")
    public ResponseEntity<Column> updateColumn(@PathVariable Long columnId, @RequestBody Column updatedColumn) {
        Column column = boardService.updateColumn(columnId, updatedColumn);
        return column != null ? new ResponseEntity<>(column, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Delete a column
    @DeleteMapping("/columns/{columnId}")
    public ResponseEntity<Void> deleteColumn(@PathVariable Long columnId) {
        boardService.deleteColumn(columnId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Add a new task to a column
    @PostMapping("/columns/{columnId}/tasks")
    public ResponseEntity<Task> addTaskToColumn(@PathVariable Long columnId, @RequestBody Task task) {
        Task createdTask = boardService.addTaskToColumn(columnId, task);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    // Update a task
    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<Task> updateTask(@PathVariable Long taskId, @RequestBody Task updatedTask) {
        Task task = boardService.updateTask(taskId, updatedTask);
        return task != null ? new ResponseEntity<>(task, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Delete a task
    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        boardService.deleteTask(taskId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
