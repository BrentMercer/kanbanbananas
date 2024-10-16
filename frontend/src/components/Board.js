import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import SettingsModal from './SettingsModal';
import CustomizeColumnsModal from './CustomizeColumnsModal';
import NewTaskModal from './NewTaskModal';
import TaskDetailModal from './TaskDetailModal.js';
import './Board.css';
import './Column.css';
import './Task.css';
import './TaskDetailModal.css';
import taskService from '../services/taskService.js';
import boardService from '../services/boardService.js';
import { jsPDF } from 'jspdf';
import axiosInstance from "../services/axiosInstance";

const Board = ({ searchText, onColumnsFetched  }) => {
    const [columns, setColumns] = useState([]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isCustomizeColumnsOpen, setIsCustomizeColumnsOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [currentColumnId, setCurrentColumnId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [reRenderKey, setReRenderKey] = useState(0);


    useEffect(() => {
        axiosInstance.get('/boards/1')
            .then(response => {
                console.log("Fetched Board Data:", response.data)
                const fetchedColumns = response.data.columns.map((column) => ({
                    ...column,
                    id: column.id.toString(),
                    tasks: column.tasks.map((task) => ({
                        ...task,
                        id: task.id.toString(),
                    })),
                }));
                setColumns(fetchedColumns);
                onColumnsFetched(fetchedColumns);
            })
            .catch(error => {
                console.error('Error fetching board data:', error);
            });
    }, []);

    useEffect(() => {
        console.log("Columns state updated:", columns);
    }, [columns]);


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


    const openTaskModal = function (columnId) {
        setCurrentColumnId(columnId);
        setSelectedTask(null);
        setIsTaskModalOpen(true);
    };

    const openTaskDetailModal = (task) => {
        console.log("Opening Task Detail Modal for task:", task);
        setSelectedTask(task);
    };


    const onDragStart = function (result) {
        console.log("Drag started:", result);
    };

    const onDragUpdate = function (result) {
        console.log("Drag update:", result);
    };

    const onDragEnd = function (result) {
        const destination = result.destination;
        const source = result.source;
        const draggableId = result.draggableId;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            console.log("No change in task position");
            return;
        }

        const sourceColumn = columns.find(
            column => column.id === source.droppableId
        );
        const destinationColumn = columns.find(
            column => column.id === destination.droppableId
        );

        const movedTask = sourceColumn.tasks[source.index];

        const newSourceTaskList = Array.from(sourceColumn.tasks);
        newSourceTaskList.splice(source.index, 1);

        if (source.droppableId === destination.droppableId) {
            newSourceTaskList.splice(destination.index, 0, movedTask);

            const reorderedTasks = newSourceTaskList.map((task, index) => ({
                ...task,
                orderIndex: index,
            }));

            setColumns(columns.map(column => {
                if (column.id === source.droppableId) {
                    return { ...column, tasks: reorderedTasks };
                }
                return column;
            }));

            const updatedTask = {
                ...movedTask,
                orderIndex: destination.index,
            };

            console.log("Updated Task being reordered within the same column:", updatedTask);

            taskService.updateTask(movedTask.id, updatedTask)
                .then(response => {
                    console.log("Task reordered successfully in the backend:", response.data);
                })
                .catch(error => {
                    console.error("Error reordering task:", error.response ? error.response.data : error.message);
                });

            return;
        }

        const newDestinationTaskList = Array.from(destinationColumn.tasks);
        newDestinationTaskList.splice(destination.index, 0, movedTask);

        const reorderedSourceTasks = newSourceTaskList.map((task, index) => ({
            ...task,
            orderIndex: index,
        }));

        const reorderedDestinationTasks = newDestinationTaskList.map((task, index) => ({
            ...task,
            orderIndex: index,
        }));

        setColumns(columns.map(column => {
            if (column.id === source.droppableId) {
                return { ...column, tasks: reorderedSourceTasks };
            } else if (column.id === destination.droppableId) {
                return { ...column, tasks: reorderedDestinationTasks };
            }
            return column;
        }));

        const updatedTask = {
            ...movedTask,
            columnId: destinationColumn.id,
            orderIndex: destination.index,
        };

        console.log("Updated Task being moved to another column:", updatedTask);

        taskService.updateTask(movedTask.id, updatedTask)
            .then(response => {
                console.log("Task moved successfully in the backend:", response.data);
            })
            .catch(error => {
                console.error("Error moving task:", error.response ? error.response.data : error.message);
            });

        console.log("Calling updateTask with ID:", movedTask.id, "and data:", updatedTask);
    };


    // console.log("Task being passed to modal:", selectedTask);

    const filterTasks = (tasks) => {
        return tasks.filter(task =>
            task.title.toLowerCase().includes(searchText.toLowerCase()) ||
            task.details.toLowerCase().includes(searchText.toLowerCase())
        );
    };

    return (
        <DragDropContext
            key={reRenderKey}
            onDragStart={onDragStart}
            onDragUpdate={onDragUpdate}
            onDragEnd={onDragEnd}
        >
            <div className="board-container">
                <div className="board">
                    {columns.map(function (column) {
                        return (
                            <Column
                                key={column.id}
                                column={column}
                                tasks={filterTasks(column.tasks)}
                                openTaskModal={openTaskModal}
                                openTaskDetailModal={openTaskDetailModal}
                            />
                        );
                    })}
                </div>

                {/*<button className="settings-button" onClick={function () { setIsSettingsOpen(true); }}>*/}
                {/*    Settings*/}
                {/*</button>*/}

                {isSettingsOpen && (
                    <SettingsModal
                        onClose={function () { setIsSettingsOpen(false); }}
                        openCustomizeBoardModal={function () {
                            setIsSettingsOpen(false);
                            setIsCustomizeColumnsOpen(true);
                        }}
                    />
                )}

                {isCustomizeColumnsOpen && (
                    <CustomizeColumnsModal
                        columns={columns}
                        setColumns={setColumns}
                        onClose={function () { setIsCustomizeColumnsOpen(false); }}
                    />
                )}

                {isTaskModalOpen && (
                    <NewTaskModal
                        columnId={currentColumnId}
                        addTask={addTask}
                        task={selectedTask}
                        onClose={function () {
                            setIsTaskModalOpen(false);
                            setSelectedTask(null);
                        }}
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
            </div>
        </DragDropContext>
    );
};

export default Board;
