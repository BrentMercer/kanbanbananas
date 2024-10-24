import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import './Board.css';
import './Column.css';
import './Task.css';
import './TaskDetailModal.css';
import taskService from '../services/taskService.js';

const Board = ({ searchText, columns, setColumns, openTaskModal, openTaskDetailModal    }) => {
    const [reRenderKey, setReRenderKey] = useState(0);

    useEffect(() => {
        console.log("Columns state updated:", columns);
    }, [columns]);


    const onDragStart = function (result) {
        console.log("Drag started:", result);
    };

    const onDragUpdate = function (result) {
        console.log("Drag update:", result);
    };

    const onDragEnd = function (result) {
        const destination = result.destination;
        const source = result.source;

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

        // Task moved inside same column
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

            // console.log("Updated Task being reordered within the same column:", updatedTask);

            taskService.updateTask(movedTask.id, updatedTask)
                .then(response => {
                    console.log("Task reordered successfully in the backend:", response.data);
                })
                .catch(error => {
                    console.error("Error reordering task:", error.response ? error.response.data : error.message);
                });

            return;
        }

        // Task moved to different column
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

        // console.log("Calling updateTask with ID:", movedTask.id, "and data:", updatedTask);
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
            </div>
        </DragDropContext>
    );
};

export default Board;
