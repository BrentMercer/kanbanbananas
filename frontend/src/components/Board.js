import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import SettingsModal from './SettingsModal';
import CustomizeColumnsModal from './CustomizeColumnsModal';
import NewTaskModal from './NewTaskModal';
import TaskDetailModal from "./TaskDetailModal.js";
import './Board.css';
import './Column.css';
import './Task.css';
import './TaskDetailModal.css';

const Board = () => {
    const [columns, setColumns] = useState([
        { id: '1', title: 'Column 1', tasks: [{ id: '0', title: 'task 0', details: 'test details' }, { id: '1', title: 'task 1', details: 'test details' }] },
        { id: '2', title: 'Column 2', tasks: [{ id: '2', title: 'task 2', details: 'test details' }, { id: '3', title: 'task 3', details: 'test details' }] },
        { id: '3', title: 'Column 3', tasks: [{ id: '4', title: 'task 4', details: 'test details' }] }
    ]);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isCustomizeColumnsOpen, setIsCustomizeColumnsOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [currentColumnId, setCurrentColumnId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);

    const addTask = (columnId, newTask) => {
        console.log("Task being added/updated:", newTask);
        setColumns(prevColumns => prevColumns.map(column => {
            if (column.id === columnId) {
                const taskExists = column.tasks.some(task => task.id === newTask.id);
                if (taskExists) {
                    const updatedTasks = column.tasks.map(task => task.id === newTask.id ? { ...task, ...newTask } : task);
                    return { ...column, tasks: updatedTasks };
                } else {
                    return { ...column, tasks: [...column.tasks, newTask] };
                }
            }
            return column;
        }));
    };

    const openTaskModal = (columnId) => {
        setCurrentColumnId(columnId);
        setSelectedTask(null);
        setIsTaskModalOpen(true);
    };

    const openTaskDetailModal = (task) => {
        setSelectedTask(task);
    };

    const editTask = (task) => {
        console.log("Editing task:", task);
        const columnId = columns.find(col => col.tasks.some(t => t.id === task.id)).id;
        setColumns(prevColumns => {
            const updatedColumns = prevColumns.map(column => {
                if (column.id === columnId) {
                    const updatedTasks = column.tasks.map(t => t.id === task.id ? task : t);
                    return { ...column, tasks: updatedTasks };
                }
                return column;
            });
            return [...updatedColumns];
        });
        setIsTaskModalOpen(false);
    };

    const deleteTask = (taskId) => {
        setColumns(columns.map(column => ({
            ...column,
            tasks: column.tasks.filter(task => task.id !== taskId)
        })));
        setSelectedTask(null);
    };

    // Add logs for drag lifecycle methods
    const onDragStart = (result) => {
        console.log("Drag started:", result);
    };

    const onDragUpdate = (result) => {
        console.log("Drag update:", result);
    };

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        console.log("onDragEnd triggered:", result);

        if (!destination) return;

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            console.log("No change in task position");
            return;
        }

        const sourceColumn = columns.find(column => column.id === source.droppableId);
        const destinationColumn = columns.find(column => column.id === destination.droppableId);

        if (source.droppableId === destination.droppableId) {
            const newTaskList = Array.from(sourceColumn.tasks);
            const [movedTask] = newTaskList.splice(source.index, 1);
            newTaskList.splice(destination.index, 0, movedTask);

            const updatedColumns = columns.map(column =>
                column.id === source.droppableId ? { ...column, tasks: newTaskList } : column
            );
            setColumns(updatedColumns);
        } else {
            const sourceTaskList = Array.from(sourceColumn.tasks);
            const destinationTaskList = Array.from(destinationColumn.tasks);
            const [movedTask] = sourceTaskList.splice(source.index, 1);
            destinationTaskList.splice(destination.index, 0, movedTask);

            const updatedColumns = columns.map(column => {
                if (column.id === source.droppableId) {
                    return { ...column, tasks: sourceTaskList };
                } else if (column.id === destination.droppableId) {
                    return { ...column, tasks: destinationTaskList };
                } else {
                    return column;
                }
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
                    {columns.map((column) => (
                        <Column
                            key={column.id}
                            column={column}
                            tasks={column.tasks}
                            openTaskModal={openTaskModal}
                            openTaskDetailModal={openTaskDetailModal}
                        />
                    ))}
                </div>

                <button className="settings-button" onClick={() => setIsSettingsOpen(true)}>
                    Settings
                </button>

                {isSettingsOpen && (
                    <SettingsModal
                        onClose={() => setIsSettingsOpen(false)}
                        openCustomizeBoardModal={() => {
                            setIsSettingsOpen(false);
                            setIsCustomizeColumnsOpen(true);
                        }}
                    />
                )}

                {isCustomizeColumnsOpen && (
                    <CustomizeColumnsModal
                        columns={columns}
                        setColumns={setColumns}
                        onClose={() => setIsCustomizeColumnsOpen(false)}
                    />
                )}

                {isTaskModalOpen && (
                    <NewTaskModal
                        columnId={currentColumnId}
                        addTask={addTask}
                        task={selectedTask}
                        onClose={() => {
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
