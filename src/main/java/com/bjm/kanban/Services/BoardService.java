package com.bjm.kanban.Services;

import com.bjm.kanban.DTO.ColumnDTO;
import com.bjm.kanban.Entities.Board;
import com.bjm.kanban.Entities.Column;
import com.bjm.kanban.Entities.Task;
import com.bjm.kanban.Repository.BoardRepository;
import com.bjm.kanban.Repository.ColumnRepository;
import com.bjm.kanban.Repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BoardService {

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private ColumnRepository columnRepository;

    @Autowired
    private TaskRepository taskRepository;

    private static final Logger logger = LoggerFactory.getLogger(BoardService.class);

    public Board createBoard(Board board) {
        return boardRepository.save(board);
    }

    public Board getBoardByUserId(Long userId) {
        return boardRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Board not found for user with ID: " + userId));
    }

    public Board getBoardWithColumnsAndTasks(Long boardId) {
        return boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found with id: " + boardId));
    }

    // Encapsulation example
    public Column addColumnToBoard(Long boardId, ColumnDTO columnDTO) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found with id: " + boardId));

        Column column = new Column();
        column.setTitle(columnDTO.getTitle());
        column.setOrderIndex(columnDTO.getOrderIndex());
        column.setBoard(board);

        return columnRepository.save(column);
    }

    public List<Column> getColumnsForBoard(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));
        return board.getColumns();
    }


    public Column updateColumn(Long columnId, ColumnDTO updatedColumn) {
        logger.info("Received request to update column with ID: {}", columnId);
        logger.info("Updated column details: {}", updatedColumn);
        return columnRepository.findById(columnId)
                .map(existingColumn -> {
                    existingColumn.setTitle(updatedColumn.getTitle());
                    existingColumn.setOrderIndex(updatedColumn.getOrderIndex());
                    return columnRepository.save(existingColumn);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Column not found with id: " + columnId));
    }

    public void deleteColumn(Long columnId) {
        if (columnRepository.existsById(columnId)) {
            columnRepository.deleteById(columnId);
        } else {
            throw new ResourceNotFoundException("Column not found with id: " + columnId);
        }
    }

    public Task addTaskToColumn(Long columnId, Task task) {
        Column column = columnRepository.findById(columnId)
                .orElseThrow(() -> new ResourceNotFoundException("Column not found with id: " + columnId));
        task.setColumn(column);
        return taskRepository.save(task);
    }

    public Task updateTask(Long taskId, Task updatedTask) {
        return taskRepository.findById(taskId)
                .map(existingTask -> {
                    existingTask.setTitle(updatedTask.getTitle());
                    existingTask.setDetails(updatedTask.getDetails());
                    existingTask.setOrderIndex(updatedTask.getOrderIndex());
                    return taskRepository.save(existingTask);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
    }

    public void deleteTask(Long taskId) {
        if (taskRepository.existsById(taskId)) {
            taskRepository.deleteById(taskId);
        } else {
            throw new ResourceNotFoundException("Task not found with id: " + taskId);
        }
    }
}
