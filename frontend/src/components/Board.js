import React, { useState } from 'react';
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

const Board = () => {
    const [columns, setColumns] = useState([
        {
            id: '1',
            title: 'Column 1',
            tasks: [
                { id: '0', title: 'task 0', details: 'test details' },
                { id: '1', title: 'task 1', details: 'test details' }
            ]
        },
        {
            id: '2',
            title: 'Column 2',
            tasks: [
                { id: '2', title: 'task 2', details: 'test details' },
                { id: '3', title: 'task 3', details: 'test details' }
            ]
        },
        {
            id: '3',
            title: 'Column 3',
            tasks: [
                { id: '4', title: 'task 4', details: 'test details' }
            ]
        }
    ]);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isCustomizeColumnsOpen, setIsCustomizeColumnsOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [currentColumnId, setCurrentColumnId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);

    const addTask = function (columnId, newTask) {
        console.log("Task being added/updated:", newTask);

        setColumns(function (prevColumns) {
            return prevColumns.map(function (column) {
                if (column.id === columnId) {
                    const taskExists = column.tasks.some(function (task) {
                        return task.id === newTask.id;
                    });

                    if (taskExists) {
                        const updatedTasks = column.tasks.map(function (task) {
                            if (task.id === newTask.id) {
                                return Object.assign({}, task, newTask);
                            } else {
                                return task;
                            }
                        });
                        return Object.assign({}, column, { tasks: updatedTasks });
                    } else {
                        return Object.assign({}, column, { tasks: column.tasks.concat(newTask) });
                    }
                }
                return column;
            });
        });
    };

    const openTaskModal = function (columnId) {
        setCurrentColumnId(columnId);
        setSelectedTask(null);
        setIsTaskModalOpen(true);
    };

    const openTaskDetailModal = function (task) {
        setSelectedTask(task);
    };

    const editTask = function (task) {
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
            return updatedColumns.slice(); // returning a new array with updated columns
        });
        setIsTaskModalOpen(false);
    };

    const deleteTask = function (taskId) {
        setColumns(columns.map(function (column) {
            return Object.assign({}, column, {
                tasks: column.tasks.filter(function (task) {
                    return task.id !== taskId;
                })
            });
        }));
        setSelectedTask(null);
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

        console.log("onDragEnd triggered:", result);

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            console.log("No change in task position");
            return;
        }

        const sourceColumn = columns.find(function (column) {
            return column.id === source.droppableId;
        });

        const destinationColumn = columns.find(function (column) {
            return column.id === destination.droppableId;
        });

        if (source.droppableId === destination.droppableId) {
            const newTaskList = Array.from(sourceColumn.tasks);
            const movedTask = newTaskList.splice(source.index, 1)[0];
            newTaskList.splice(destination.index, 0, movedTask);

            const updatedColumns = columns.map(function (column) {
                if (column.id === source.droppableId) {
                    return Object.assign({}, column, { tasks: newTaskList });
                }
                return column;
            });
            setColumns(updatedColumns);
        } else {
            const sourceTaskList = Array.from(sourceColumn.tasks);
            const destinationTaskList = Array.from(destinationColumn.tasks);
            const movedTask = sourceTaskList.splice(source.index, 1)[0];
            destinationTaskList.splice(destination.index, 0, movedTask);

            const updatedColumns = columns.map(function (column) {
                if (column.id === source.droppableId) {
                    return Object.assign({}, column, { tasks: sourceTaskList });
                } else if (column.id === destination.droppableId) {
                    return Object.assign({}, column, { tasks: destinationTaskList });
                }
                return column;
            });
            setColumns(updatedColumns);
        }
    };

    console.log("Task being passed to modal:", selectedTask);

    return (
        <DragDropContext
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
                                tasks={column.tasks}
                                openTaskModal={openTaskModal}
                                openTaskDetailModal={openTaskDetailModal}
                            />
                        );
                    })}
                </div>

                <button className="settings-button" onClick={function () { setIsSettingsOpen(true); }}>
                    Settings
                </button>

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
                        onClose={function () { setSelectedTask(null); }}
                        onEdit={editTask}
                        onDelete={deleteTask}
                    />
                )}
            </div>
        </DragDropContext>
    );
};

export default Board;
