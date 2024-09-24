package com.bjm.kanban.Controller;

import com.bjm.kanban.DTO.ColumnDTO;
import com.bjm.kanban.DTO.TaskDTO;
import com.bjm.kanban.Entities.Column;
import com.bjm.kanban.Entities.Task;
import com.bjm.kanban.Services.ColumnService;
import com.bjm.kanban.Services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/board_columns")
public class ColumnController {

    @Autowired
    private ColumnService columnService;

    @Autowired
    private TaskService taskService;

    @GetMapping
    public List<Column> getAllColumns() {
        return columnService.getAllColumns();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Column> getColumnById(@PathVariable Long id) {
        Optional<Column> column = columnService.getColumnById(id);
        return column.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/board_columns/{columnId}/tasks")
    public ResponseEntity<List<TaskDTO>> getTasksByColumnId(@PathVariable Long columnId) {
        List<TaskDTO> tasks = taskService.getTasksByColumnId(columnId);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @PostMapping("/boards/{boardId}/board_columns")
    public ResponseEntity<Column> createColumnForBoard(@PathVariable Long boardId, @RequestBody ColumnDTO columnDTO) {
        Column createdColumn = columnService.createColumnForBoard(boardId, columnDTO);
        return new ResponseEntity<>(createdColumn, HttpStatus.CREATED);
    }

    @PostMapping("/{columnId}/tasks")
    public ResponseEntity<Task> addTaskToColumn(@PathVariable Long columnId, @RequestBody TaskDTO taskDTO) {
        Task createdTask = taskService.createTaskForColumn(columnId, taskDTO);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Column> updateColumn(@PathVariable Long id, @RequestBody ColumnDTO updatedColumn) {
        Optional<Column> existingColumn = columnService.getColumnById(id);

        if (existingColumn.isPresent()) {
            Column columnToUpdate = existingColumn.get();
            columnToUpdate.setTitle(updatedColumn.getTitle());
            columnToUpdate.setOrderIndex(updatedColumn.getOrderIndex());
            columnService.saveColumn(columnToUpdate);
            return ResponseEntity.ok(columnToUpdate);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteColumn(@PathVariable Long id) {
        columnService.deleteColumn(id);
        return ResponseEntity.noContent().build();
    }
}
