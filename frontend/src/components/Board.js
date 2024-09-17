import React, { useState, useEffect } from 'react';
import Task from './Task';
import Column from "./Column";
import './Board.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Board = () => {
    const [columns, setColumns] = useState([
        { id: '1', title: 'Column 1', tasks: ['Task 1', 'Task 2'] },
        { id: '2', title: 'Column 2', tasks: ['Task 3'] },
        { id: '3', title: 'Column 3', tasks: [] },
        { id: '4', title: 'Column 4', tasks: [] },
        { id: '5', title: 'Column 5', tasks: [] }
    ]);

    return (
        <div className="wrapper">
            <h2>My Board</h2>
            <div className="board-container">
                <div className="board">
                    {columns.map(column => (
                        <div key={column.id} className="column">
                            <h3>{column.title}</h3>
                            {column.tasks.length > 0 ? (
                                column.tasks.map((task, index) => (
                                    <Task key={index} title={task} />
                                ))
                            ) : (
                                <p>No tasks yet</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Board;
