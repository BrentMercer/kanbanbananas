package com.bjm.kanban;

import com.bjm.kanban.DTO.ColumnDTO;
import com.bjm.kanban.Entities.Board;
import com.bjm.kanban.Entities.Column;
import com.bjm.kanban.Repository.BoardRepository;
import com.bjm.kanban.Repository.ColumnRepository;
import com.bjm.kanban.Services.ColumnService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@SpringBootTest
public class ColumnServiceTest {

    @MockBean
    private ColumnRepository columnRepository;

    @MockBean
    private BoardRepository boardRepository;

    @Autowired
    private ColumnService columnService;

    @Test
    public void testCreateNewColumn() {
        Board mockBoard = new Board();
        mockBoard.setId(1L);
        mockBoard.setTitle("Mock Board");

        when(boardRepository.findById(1L)).thenReturn(Optional.of(mockBoard));

        ColumnDTO columnDTO = new ColumnDTO("New Column", 0);
        Column mockColumn = new Column("New Column", 0, mockBoard);

        when(columnRepository.save(any(Column.class))).thenReturn(mockColumn);

        Column createdColumn = columnService.createColumnForBoard(1L, columnDTO);

        assertThat(createdColumn.getTitle()).isEqualTo("New Column");
        assertThat(createdColumn.getOrderIndex()).isEqualTo(0);
        assertThat(createdColumn.getBoard()).isEqualTo(mockBoard);

        verify(boardRepository).findById(1L);
        verify(columnRepository).save(any(Column.class));
    }

    @Test
    public void testDeleteColumn() {
        Long columnId = 1L;
        columnService.deleteColumn(columnId);
        verify(columnRepository).deleteById(columnId);
    }
}
