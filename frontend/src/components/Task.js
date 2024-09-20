import React from 'react';
import './Task.css';
import { Draggable } from 'react-beautiful-dnd';

const Task = ({ task, index }) => {
    console.log("Task ID:", task.id);
    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided) => (
                <div
                    className="task"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <h4>{task.title}</h4>
                    <p>{task.details}</p>

                </div>
            )}
        </Draggable>
    );
};

export default Task;
