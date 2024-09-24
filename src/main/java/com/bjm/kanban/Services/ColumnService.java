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

    public List<Column> getAllColumns() {
        return columnRepository.findAll();
    }

    public Optional<Column> getColumnById(Long id) {
        return columnRepository.findById(id);
    }

    public Column saveColumn(Column column) {
        return columnRepository.save(column);
    }

    public void deleteColumn(Long id) {
        columnRepository.deleteById(id);
    }
}
