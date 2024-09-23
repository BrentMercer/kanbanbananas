package com.bjm.kanban.Services;

import com.bjm.kanban.Entities.Column;
import com.bjm.kanban.Repository.ColumnRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ColumnService {

    @Autowired
    private ColumnRepository columnRepository;

    // Get all columns
    public List<Column> getAllColumns() {
        return columnRepository.findAll();
    }

    // Get a column by ID
    public Optional<Column> getColumnById(Long id) {
        return columnRepository.findById(id);
    }

    // Create or update a column
    public Column saveColumn(Column column) {
        return columnRepository.save(column);
    }

    // Delete a column by ID
    public void deleteColumn(Long id) {
        columnRepository.deleteById(id);
    }
}
