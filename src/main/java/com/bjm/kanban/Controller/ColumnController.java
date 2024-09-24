package com.bjm.kanban.Controller;

import com.bjm.kanban.DTO.ColumnDTO;
import com.bjm.kanban.Entities.Column;
import com.bjm.kanban.Services.ColumnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/board_columns")
public class ColumnController {

    @Autowired
    private ColumnService columnService;

    @GetMapping
    public List<Column> getAllColumns() {
        return columnService.getAllColumns();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Column> getColumnById(@PathVariable Long id) {
        Optional<Column> column = columnService.getColumnById(id);
        return column.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Column createOrUpdateColumn(@RequestBody Column column) {
        return columnService.saveColumn(column);
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
