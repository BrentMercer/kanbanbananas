package com.bjm.kanban.Services;

import com.bjm.kanban.Entities.Board;
import com.bjm.kanban.Entities.Column;
import com.bjm.kanban.Entities.Task;
import com.bjm.kanban.Repository.BoardRepository;
import com.bjm.kanban.Repository.ColumnRepository;
import com.bjm.kanban.Repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    public Board getBoardWithColumnsAndTasks(Long boardId) {
        return boardRepository.findById(boardId).orElse(null);
    }

    public Column addColumnToBoard(Long boardId, Column column) {
        Board board = boardRepository.findById(boardId).orElse(null);
        if (board != null) {
            column.setBoard(board);
            return columnRepository.save(column);
        }
        return null;
    }

    // Update a column
    public Column updateColumn(Long columnId, Column updatedColumn) {
        return columnRepository.findById(columnId)
                .map(existingColumn -> {
                    existingColumn.setTitle(updatedColumn.getTitle());
                    existingColumn.setOrderIndex(updatedColumn.getOrderIndex());
                    return columnRepository.save(existingColumn);
                })
                .orElse(null);
    }

    // Delete a column
    public void deleteColumn(Long columnId) {
        columnRepository.deleteById(columnId);
    }

    // Add a task to a column
    public Task addTaskToColumn(Long columnId, Task task) {
        Column column = columnRepository.findById(columnId).orElse(null);
        if (column != null) {
            task.setColumn(column);
            return taskRepository.save(task);
        }
        return null;
    }

    // Update a task
    public Task updateTask(Long taskId, Task updatedTask) {
        return taskRepository.findById(taskId)
                .map(existingTask -> {
                    existingTask.setTitle(updatedTask.getTitle());
                    existingTask.setDetails(updatedTask.getDetails());
                    existingTask.setOrderIndex(updatedTask.getOrderIndex());
                    return taskRepository.save(existingTask);
                })
                .orElse(null);
    }

    // Delete a task
    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }
}
