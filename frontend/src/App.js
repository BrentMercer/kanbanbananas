import React, { useEffect, useState } from "react";
import Board from './components/Board';
import SettingsModal from "./components/SettingsModal";
import CustomizeColumnsModal from "./components/CustomizeColumnsModal";
import LoginModal from "./components/LoginModal";
import './App.css';
import { jsPDF } from 'jspdf';
import axiosInstance from "./services/axiosInstance";
import taskService from "./services/taskService";
import NewTaskModal from "./components/NewTaskModal";
import TaskDetailModal from "./components/TaskDetailModal";

const App = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isCustomizeColumnsOpen, setIsCustomizeColumnsOpen] = useState(false);
    const [columns, setColumns] = useState([]);
    const [timeForRefresh, setTimeForRefresh] = useState(0);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [currentColumnId, setCurrentColumnId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [reRenderKey, setReRenderKey] = useState(0);
    const [boardId, setBoardId] = useState(null);


    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedBoardId = localStorage.getItem("boardId");

        if (storedToken) {
            console.log("Token found in localStorage. Setting authenticated state to true.");
            setIsAuthenticated(true);
            if (storedBoardId) {
                setBoardId(storedBoardId);
            }
        } else {
            console.log("No token found. Authentication required.");
            setIsAuthenticated(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated && boardId) {
            console.log("Authenticated and boardId is available. Fetching columns.");
            fetchColumns(boardId);
        }
    }, [isAuthenticated, boardId]);



    const handleLogin = (boardIdFromLogin, jwtToken) => {
        console.log("Logged in with boardId:", boardIdFromLogin);
        setIsAuthenticated(true);
        setIsLoginModalOpen(false);
        setBoardId(boardIdFromLogin);

        localStorage.setItem("token", jwtToken);
        localStorage.setItem("boardId", boardIdFromLogin);

        fetchColumns(boardIdFromLogin);
    };



    const handleRegister = (email, password) => {
        console.log("Registering user:", { email, password });
        setIsAuthenticated(true);
        setIsLoginModalOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("boardId");
        
        setIsAuthenticated(false);
        setIsLoginModalOpen(true);
        setBoardId(null);
    };


    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    const openTaskModal = function (columnId) {
        setCurrentColumnId(columnId);
        setSelectedTask(null);
        setIsTaskModalOpen(true);
    };

    const openTaskDetailModal = (task) => {
        console.log("Opening Task Detail Modal for task:", task);
        setSelectedTask(task);
    };

    const handleModalClose = () => {
        setIsCustomizeColumnsOpen(false);
        setTimeForRefresh(prevKey => prevKey + 1);
    };



    const fetchColumns = async (boardId) => {
        console.log("Fetching columns for boardId:", boardId);
        try {
            const response = await axiosInstance.get(`/boards/${boardId}`);
            console.log("Columns data:", response.data.columns);
            const fetchedColumns = response.data.columns.map((column) => ({
                ...column,
                id: column.id.toString(),
                tasks: column.tasks.map((task) => ({
                    ...task,
                    id: task.id.toString(),
                })),
            }));
            setColumns(fetchedColumns);
        } catch (error) {
            console.error('Error fetching board data:', error);
        }
    };




    const addTask = function (columnId, newTask) {
        console.log("Task being added/updated:", newTask);

        const targetColumn = columns.find(column => column.id === columnId);
        const newOrderIndex = targetColumn.tasks.length;

        axiosInstance.post(`/tasks`, {
            title: newTask.title,
            details: newTask.details,
            orderIndex: newOrderIndex,
            columnId: columnId,
        })
            .then((response) => {
                const createdTask = response.data; // Task with valid ID from backend
                console.log("Task created successfully in the backend:", createdTask);

                setColumns(function (prevColumns) {
                    return prevColumns.map(function (column) {
                        if (column.id === columnId) {
                            return {
                                ...column,
                                tasks: [...column.tasks, createdTask],
                            };
                        }
                        return column;
                    });
                });
                window.location.reload();
                setReRenderKey(prevKey => prevKey + 1);
            })
            .catch((error) => {
                console.error("Error creating task in the backend:", error);
            });
    };

    const editTask = async function (task) {
        console.log("Editing task:", task);
        const columnId = columns.find(function (col) {
            return col.tasks.some(function (t) {
                return t.id === task.id;
            });
        }).id;

        setColumns(function (prevColumns) {
            const updatedColumns = prevColumns.map(function (column) {
                if (column.id === columnId) {
                    const updatedTasks = column.tasks.map(function (t) {
                        if (t.id === task.id) {
                            return task;
                        } else {
                            return t;
                        }
                    });
                    return Object.assign({}, column, { tasks: updatedTasks });
                }
                return column;
            });
            return updatedColumns.slice();
        });

        try {
            console.log("Saving task with updated details:", task);
            await taskService.updateTask(task.id, task);
            console.log("Task updated successfully.");
        } catch (error) {
            console.error("Error updating task:", error);
        }

        setIsTaskModalOpen(false);
    };

    const deleteTask = function (taskId) {
        console.log("Deleting task with ID:", taskId);

        taskService.deleteTask(taskId)
            .then(() => {
                console.log("Task deleted successfully from the backend");

                setColumns((prevColumns) => {
                    return prevColumns.map((column) => ({
                        ...column,
                        tasks: column.tasks.filter((task) => task.id !== taskId),
                    }));
                });
            })
            .catch((error) => {
                console.error("Error deleting task from the backend:", error);
            });

    };

    const generateReport = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text('Task Report', 10, 10);

        const date = new Date();
        doc.setFontSize(12);
        doc.text(`Generated on: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`, 10, 20);

        let yPosition = 30;

        columns.forEach((column) => {
            doc.setFontSize(14);
            doc.text(`${column.title}`, 10, yPosition);
            yPosition += 10;

            column.tasks.forEach((task, index) => {
                doc.setFontSize(12);
                doc.text(`${index + 1}. ${task.title}`, 10, yPosition);
                yPosition += 5;
                doc.text(`   ${task.details}`, 10, yPosition);
                yPosition += 10;
            });

            yPosition += 10;
        });

        doc.save('task_report.pdf');
    };


    return (
        <div className="App">
            <header className="app-header">
                <span className="board-id">Board ID: {boardId ? boardId : 'No board loaded'}</span>
                <h1>Kanban Bananas</h1>
                <div className="search-settings">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchText}
                        onChange={handleSearchChange}
                        className="search-bar"
                    />

                    <button className="reports-button" onClick={generateReport}>
                        Generate Report
                    </button>

                    <button className="settings-button" onClick={() => setIsSettingsOpen(true)}>
                        Settings
                    </button>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>

                {!isAuthenticated && isLoginModalOpen && (
                    <LoginModal
                        onClose={() => setIsLoginModalOpen(false)}
                        onLogin={handleLogin}
                        onRegister={handleRegister}
                    />
                )}

                {isSettingsOpen && (
                    <SettingsModal
                        onClose={() => setIsSettingsOpen(false)}
                        openCustomizeBoardModal={() => setIsCustomizeColumnsOpen(true)}
                    />
                )}

                {isCustomizeColumnsOpen && (
                    <CustomizeColumnsModal
                        columns={columns}
                        setColumns={setColumns}
                        boardId={boardId}
                        onClose={handleModalClose}
                    />
                )}

                {isTaskModalOpen && (
                    <NewTaskModal
                        columnId={currentColumnId}
                        addTask={addTask}
                        task={selectedTask}
                        onClose={() => setIsTaskModalOpen(false)}
                    />
                )}

                {selectedTask && (
                    <TaskDetailModal
                        task={selectedTask}
                        onClose={() => setSelectedTask(null)}
                        onEdit={editTask}
                        onDelete={deleteTask}
                    />
                )}
            </header>
            {isAuthenticated && (
                <Board
                    searchText={searchText}
                    columns={columns}
                    setColumns={setColumns}
                    openTaskModal={openTaskModal}
                    openTaskDetailModal={openTaskDetailModal}
                />
            )}
        </div>
    );

};

export default App;
