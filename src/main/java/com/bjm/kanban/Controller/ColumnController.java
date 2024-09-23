package com.bjm.kanban.Controller;

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

    // Get all columns
    @GetMapping
    public List<Column> getAllColumns() {
        return columnService.getAllColumns();
    }

    // Get a specific column by ID
    @GetMapping("/{id}")
    public ResponseEntity<Column> getColumnById(@PathVariable Long id) {
        Optional<Column> column = columnService.getColumnById(id);
        return column.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create or update a column
    @PostMapping
    public Column createOrUpdateColumn(@RequestBody Column column) {
        return columnService.saveColumn(column);
    }

    // Delete a column by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteColumn(@PathVariable Long id) {
        columnService.deleteColumn(id);
        return ResponseEntity.noContent().build();
    }
}
