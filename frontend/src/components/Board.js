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
        { id: '1', title: 'Column 1', tasks: [] },
        { id: '2', title: 'Column 2', tasks: [] },
        { id: '3', title: 'Column 3', tasks: [] },
    ]);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isCustomizeColumnsOpen, setIsCustomizeColumnsOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [currentColumnId, setCurrentColumnId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);

    // Function to add a task to a column
    const addTask = (columnId, newTask) => {
        setColumns(columns.map(column =>
            column.id === columnId
                ? { ...column, tasks: [...column.tasks, newTask] }
                : column
        ));
    };

    // Open Task Modal
    const openTaskModal = (columnId) => {
        setCurrentColumnId(columnId);
        setIsTaskModalOpen(true);
    };

    // Open Task Detail Modal
    const openTaskDetailModal = (task) => {
        setSelectedTask(task);
    };

    // Edit Task (opens task modal with existing data)
    const editTask = (task) => {
        setSelectedTask(null);
        const columnId = columns.find(col => col.tasks.some(t => t.id === task.id)).id;
        setCurrentColumnId(columnId);
        setIsTaskModalOpen(true);
    };


    // Delete Task
    const deleteTask = (taskId) => {
        setColumns(columns.map(column => ({
            ...column,
            tasks: column.tasks.filter(task => task.id !== taskId)
        })));
        setSelectedTask(null);
    };

    const onDragEnd = (result) => {
        const { destination, source } = result;

        // If there is no destination (dropped outside the droppable area)
        if (!destination) return;

        // If the task is dropped in the same place, do nothing
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // Find the source and destination columns
        const sourceColumn = columns.find(column => column.id === source.droppableId);
        const destinationColumn = columns.find(column => column.id === destination.droppableId);

        // If the task is reordered within the same column
        if (source.droppableId === destination.droppableId) {
            const newTaskList = Array.from(sourceColumn.tasks);
            const [movedTask] = newTaskList.splice(source.index, 1);
            newTaskList.splice(destination.index, 0, movedTask);

            const updatedColumns = columns.map(column =>
                column.id === source.droppableId ? { ...column, tasks: newTaskList } : column
            );
            setColumns(updatedColumns);
        } else {
            // Moving the task to a different column
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

    return (
        <DragDropContext onDragEnd={onDragEnd}>
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

                {/* Settings Button */}
                <button className="settings-button" onClick={() => setIsSettingsOpen(true)}>
                    Settings
                </button>

                {/* Render the Settings modal */}
                {isSettingsOpen && (
                    <SettingsModal
                        onClose={() => setIsSettingsOpen(false)}
                        openCustomizeBoardModal={() => {
                            setIsSettingsOpen(false); // Close settings
                            setIsCustomizeColumnsOpen(true); // Open customize columns
                        }}
                    />
                )}

                {/* Render the Customize Columns modal */}
                {isCustomizeColumnsOpen && (
                    <CustomizeColumnsModal
                        columns={columns}
                        setColumns={setColumns}
                        onClose={() => setIsCustomizeColumnsOpen(false)}
                    />
                )}

            {/* Render the New Task modal */}
            {isTaskModalOpen && (
                <NewTaskModal
                    columnId={currentColumnId}
                    addTask={addTask}
                    task={selectedTask} // If selectedTask exists, it's an edit
                    onClose={() => {
                        setIsTaskModalOpen(false);
                        setSelectedTask(null); // Clear selected task after closing
                    }}
                />
            )}

            {/* Render the Task Detail modal */}
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
