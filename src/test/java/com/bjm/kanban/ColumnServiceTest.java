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
        // Step 1: Prepare a mock Board entity
        Board mockBoard = new Board();
        mockBoard.setId(1L);
        mockBoard.setTitle("Mock Board");

        // Step 2: Mock boardRepository.findById() to return this mock board
        when(boardRepository.findById(1L)).thenReturn(Optional.of(mockBoard));

        // Step 3: Prepare a ColumnDTO object to pass as an argument for createColumnForBoard()
        ColumnDTO columnDTO = new ColumnDTO("New Column", 0);

        // Step 4: Create a mock Column entity to simulate the return value of columnRepository.save()
        Column mockColumn = new Column("New Column", 0, mockBoard);

        // Step 5: Mock columnRepository.save() to return the mock column
        when(columnRepository.save(any(Column.class))).thenReturn(mockColumn);

        // Step 6: Call the method to be tested
        Column createdColumn = columnService.createColumnForBoard(1L, columnDTO);

        // Step 7: Assertions to verify the column was created correctly
        assertThat(createdColumn.getTitle()).isEqualTo("New Column");
        assertThat(createdColumn.getOrderIndex()).isEqualTo(0);
        assertThat(createdColumn.getBoard()).isEqualTo(mockBoard);

        // Verify interactions with the mocked repositories
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
