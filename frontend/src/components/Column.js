import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';


const Column = ({ column, tasks, openTaskModal, openTaskDetailModal  }) => {
    return (
        <div className="column">
            <div className="column-header">
                <h3>{column.title}</h3>
                <button className="add-task-button" onClick={() => openTaskModal(column.id)}>
                    +
                </button>
            </div>

            <Droppable droppableId={column.id}>
                {(provided) => (
                    <div
                        className="task-list"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {tasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided) => (
                                    <div
                                        className="task"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        onClick={() => openTaskDetailModal(task)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <h4>{task.title}</h4>
                                        <p>{task.details}</p>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default Column;
