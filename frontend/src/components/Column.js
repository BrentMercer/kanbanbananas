import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const Column = ({ column, tasks, openTaskModal, openTaskDetailModal }) => {
    console.log("Rendering tasks in column:", column.title, tasks);
    console.log("Droppable ID:", column.id);

    return (
        <div className="column">
            <div className="column-header">
                <h3>{column.title}</h3>
                <button className="add-task-button" onClick={() => openTaskModal(column.id)}>+</button>
            </div>

            <Droppable droppableId={column.id}>
                {(provided, snapshot) => {
                    console.log("Is dragging over column", column.id, ":", snapshot.isDraggingOver);
                    return (
                        <div
                            className="task-list"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{
                                backgroundColor: snapshot.isDraggingOver ? 'lightblue' : 'white',
                                padding: 8,
                                minHeight: 500,
                            }}
                        >
                            {tasks.map((task, index) => (
                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            className="task"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            onClick={() => openTaskDetailModal(task)}
                                            style={{
                                                userSelect: 'none',
                                                padding: 16,
                                                margin: '0 0 8px 0',
                                                backgroundColor: snapshot.isDragging ? 'lightgreen' : 'white',
                                                ...provided.draggableProps.style
                                            }}
                                        >
                                            <h4>{task.title}</h4>
                                            <p>{task.details}</p>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    );
                }}
            </Droppable>
        </div>
    );
};

export default Column;
