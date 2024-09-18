import React from 'react';
import './Task.css';
import { Draggable } from 'react-beautiful-dnd';

const Task = ({ task, index }) => {
    console.log("Task ID:", task.id);
    return (
        <div className="task-card">
        <Draggable draggableId={task.id} index={index}>
            {(provided) => (
                <div
                    className="task"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    {task.content}
                </div>
            )}
        </Draggable>
        </div>
    );
};

export default Task;
