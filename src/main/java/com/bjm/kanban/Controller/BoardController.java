package com.bjm.kanban.Controller;

import com.bjm.kanban.DTO.ColumnDTO;
import com.bjm.kanban.Entities.Board;
import com.bjm.kanban.Entities.Column;
import com.bjm.kanban.Entities.Task;
import com.bjm.kanban.Services.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/boards")
public class BoardController {

    @Autowired
    private BoardService boardService;

    @GetMapping("/{id}")
    public ResponseEntity<Board> getBoardById(@PathVariable Long id) {
        Board board = boardService.getBoardWithColumnsAndTasks(id);

        if (board != null) {
            if (board.getColumns() == null) {
                board.setColumns(new ArrayList<>());
            }

            board.getColumns().forEach(column -> {
                if (column.getTasks() == null) {
                    column.setTasks(new ArrayList<>());
                }
            });

            return new ResponseEntity<>(board, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }



    @PostMapping(value = "/{boardId}/board_columns", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Column> addColumnToBoard(@PathVariable Long boardId, @RequestBody ColumnDTO columnDTO) {
        Column createdColumn = boardService.addColumnToBoard(boardId, columnDTO);
        return new ResponseEntity<>(createdColumn, HttpStatus.CREATED);
    }

    @GetMapping("/{boardId}/board_columns")
    public ResponseEntity<List<Column>> getColumnsForBoard(@PathVariable Long boardId) {
        List<Column> columns = boardService.getColumnsForBoard(boardId);
        return new ResponseEntity<>(columns, HttpStatus.OK);
    }


    @PutMapping("/board_columns/{columnId}")
    public ResponseEntity<Column> updateColumn(@PathVariable Long columnId, @RequestBody ColumnDTO updatedColumn) {
        System.out.println("Received ColumnDTO: " + updatedColumn);
        Column column = boardService.updateColumn(columnId, updatedColumn);
        return column != null ? new ResponseEntity<>(column, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/board_columns/{columnId}")
    public ResponseEntity<Void> deleteColumn(@PathVariable Long columnId) {
        boardService.deleteColumn(columnId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/board_columns/{columnId}/tasks")
    public ResponseEntity<Task> addTaskToColumn(@PathVariable Long columnId, @RequestBody Task task) {
        Task createdTask = boardService.addTaskToColumn(columnId, task);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<Task> updateTask(@PathVariable Long taskId, @RequestBody Task updatedTask) {
        Task task = boardService.updateTask(taskId, updatedTask);
        return task != null ? new ResponseEntity<>(task, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        boardService.deleteTask(taskId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
