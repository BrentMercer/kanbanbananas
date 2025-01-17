package com.bjm.kanban;

import com.bjm.kanban.DTO.TaskDTO;
import com.bjm.kanban.Entities.Task;
import com.bjm.kanban.Entities.Column;
import com.bjm.kanban.Repository.ColumnRepository;
import com.bjm.kanban.Repository.TaskRepository;
import com.bjm.kanban.Services.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@SpringBootTest
public class TaskServiceTest {

    @MockBean
    private TaskRepository taskRepository;

    @MockBean
    private ColumnRepository columnRepository;

    @Autowired
    private TaskService taskService;

    @Test
    public void testCreateNewTask() {
        Column mockColumn = new Column();
        mockColumn.setId(1L);

        when(columnRepository.findById(1L)).thenReturn(java.util.Optional.of(mockColumn));

        TaskDTO taskDTO = new TaskDTO(); // TaskDTO
        taskDTO.setTitle("Test Task");
        taskDTO.setDetails("Test details");
        taskDTO.setOrderIndex(0);
        taskDTO.setColumnId(1L);

        Task mockTask = new Task(); // Regular task for mocking
        mockTask.setTitle("Test Task");
        mockTask.setDetails("Test details");
        mockTask.setOrderIndex(0);
        mockTask.setColumn(mockColumn);

        when(taskRepository.save(any(Task.class))).thenReturn(mockTask);

        Task createdTask = taskService.createTask(taskDTO);
        assertThat(createdTask.getTitle()).isEqualTo("Test Task");
        assertThat(createdTask.getDetails()).isEqualTo("Test details");
        assertThat(createdTask.getOrderIndex()).isEqualTo(0);
        assertThat(createdTask.getColumn()).isEqualTo(mockColumn);

        verify(columnRepository).findById(1L);
        verify(taskRepository).save(any(Task.class));

    }

    @Test
    public void testDeleteTask() {
        Long taskId = 1L;

        Task mockTask = new Task();
        mockTask.setId(taskId);
        mockTask.setTitle("Test Task");

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(mockTask));

        taskService.deleteTask(taskId);

        verify(taskRepository).delete(mockTask);
    }


}