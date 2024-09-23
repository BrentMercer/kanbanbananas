-- Insert test users
INSERT INTO user (id, username, password) VALUES (1, 'testuser', 'password');

-- Insert test boards
INSERT INTO board (id, title, user_id) VALUES (1, 'Test Board 1', 1);
INSERT INTO board (id, title, user_id) VALUES (2, 'Test Board 2', 1);

-- Insert test columns (notice the use of 'board_columns' table name)
INSERT INTO board_columns (id, title, order_index, board_id) VALUES (1, 'To Do', 1, 1);
INSERT INTO board_columns (id, title, order_index, board_id) VALUES (2, 'In Progress', 2, 1);
INSERT INTO board_columns (id, title, order_index, board_id) VALUES (3, 'Done', 3, 1);

-- Insert test tasks
INSERT INTO task (id, title, details, column_id) VALUES (1, 'Task 1', 'Details for Task 1', 1);
INSERT INTO task (id, title, details, column_id) VALUES (2, 'Task 2', 'Details for Task 2', 2);
INSERT INTO task (id, title, details, column_id) VALUES (3, 'Task 3', 'Details for Task 3', 3);
