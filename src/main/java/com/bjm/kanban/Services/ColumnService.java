package com.bjm.kanban.Services;

import com.bjm.kanban.DTO.ColumnDTO;
import com.bjm.kanban.Entities.Board;
import com.bjm.kanban.Entities.Column;
import com.bjm.kanban.Repository.BoardRepository;
import com.bjm.kanban.Repository.ColumnRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ColumnService {

    @Autowired
    private ColumnRepository columnRepository;

    @Autowired
    private BoardRepository boardRepository;

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

    public Column createColumnForBoard(Long boardId, ColumnDTO columnDTO) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));

        Column column = new Column();
        column.setTitle(columnDTO.getTitle());
        column.setOrderIndex(columnDTO.getOrderIndex());
        column.setBoard(board);

        return columnRepository.save(column);
    }


}
