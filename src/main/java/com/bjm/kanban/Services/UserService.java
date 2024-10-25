package com.bjm.kanban.Services;

import com.bjm.kanban.DTO.TaskDTO;
import com.bjm.kanban.Entities.Board;
import com.bjm.kanban.Entities.Column;
import com.bjm.kanban.Entities.User;
import com.bjm.kanban.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BoardService boardService;

    @Autowired
    private ColumnService columnService;

    @Autowired
    private TaskService taskService;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User createOrUpdateUser(User user) {
        User savedUser = userRepository.save(user);
        createDefaultUserBoard(savedUser);

        return savedUser;
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public void createDefaultUserBoard(User user) {
        Board board = new Board();
        board.setTitle("Default Board");
        board.setUser(user);
        board = boardService.createBoard(board);

        Column backlog = new Column();
        backlog.setTitle("Backlog");
        backlog.setOrderIndex(0);
        backlog.setBoard(board);
        backlog = columnService.saveColumn(backlog);

        Column inProgress = new Column();
        inProgress.setTitle("In-progress");
        inProgress.setOrderIndex(1);
        inProgress.setBoard(board);
        inProgress = columnService.saveColumn(inProgress);

        Column completed = new Column();
        completed.setTitle("Completed");
        completed.setOrderIndex(2);
        completed.setBoard(board);
        completed = columnService.saveColumn(completed);

        TaskDTO sampleTaskDTO = new TaskDTO();
        sampleTaskDTO.setTitle("Sample task");
        sampleTaskDTO.setDetails("Drag me to another column!");
        sampleTaskDTO.setOrderIndex(0);
        sampleTaskDTO.setColumnId(backlog.getId());

        taskService.createTaskForColumn(backlog.getId(), sampleTaskDTO);
    }
}

