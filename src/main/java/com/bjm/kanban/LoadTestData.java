package com.bjm.kanban;

import com.bjm.kanban.Entities.Board;
import com.bjm.kanban.Entities.Column;
import com.bjm.kanban.Entities.Task;
import com.bjm.kanban.Entities.User;
import com.bjm.kanban.Repository.BoardRepository;
import com.bjm.kanban.Repository.ColumnRepository;
import com.bjm.kanban.Repository.TaskRepository;
import com.bjm.kanban.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

    @Component
    public class LoadTestData implements CommandLineRunner {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private BoardRepository boardRepository;

        @Autowired
        private ColumnRepository columnRepository;

        @Autowired
        private TaskRepository taskRepository;

        @Override
        public void run(String... args) throws Exception {
            if (userRepository.count() == 0 && boardRepository.count() == 0) {
                // Create default user
                User defaultUser = new User();
                defaultUser.setUsername("defaultUser");
                defaultUser.setEmail("default@kanban.com");
                defaultUser.setPassword("password"); // make sure this is hashed if security is a concern
                userRepository.save(defaultUser);

                // Create default board
                Board defaultBoard = new Board();
                defaultBoard.setTitle("Default Board");
                defaultBoard.setUser(defaultUser);
                boardRepository.save(defaultBoard);

                // Create default columns
                Column backlog = new Column("Backlog", 0, defaultBoard);
                Column inProgress = new Column("In Progress", 1, defaultBoard);
                Column completed = new Column("Completed", 2, defaultBoard);

                columnRepository.saveAll(Arrays.asList(backlog, inProgress, completed));

                // Create a sample task
                Task sampleTask = new Task();
                sampleTask.setTitle("Sample Task");
                sampleTask.setDetails("This is a sample task!");
                sampleTask.setColumn(backlog);
                sampleTask.setOrderIndex(0);
                taskRepository.save(sampleTask);

                System.out.println("Database initialized with default user, board, columns, and sample task.");
            }
            else {
                System.out.println("Data already exists, skipping setup.");
            }
        }
    }

