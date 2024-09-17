import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const Column = ({ column, tasks }) => {
    return (
        <Droppable droppableId={column.id}>
            {(provided) => (
                <div
                    className="column"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    <h3>{column.title}</h3>
                    {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
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
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};

export default Column;
