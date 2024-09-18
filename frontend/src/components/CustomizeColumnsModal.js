import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './CustomizeColumnsModal.css';

const CustomizeColumnsModal = ({ columns, onClose, setColumns }) => {
    const [newColumnName, setNewColumnName] = useState('');

    // Handle reordering columns
    const onDragEnd = (result) => {
        const { destination, source } = result;

        if (!destination) return;

        const reorderedColumns = Array.from(columns);
        const [movedColumn] = reorderedColumns.splice(source.index, 1);
        reorderedColumns.splice(destination.index, 0, movedColumn);

        setColumns(reorderedColumns);
    };

    const addColumn = () => {
        if (newColumnName.trim()) {
            const newColumn = { id: `col-${Date.now()}`, title: newColumnName, tasks: [] };
            setColumns([...columns, newColumn]); // Add new column at the top
            setNewColumnName(''); // Reset input field
        }
    };

    const renameColumn = (index, newTitle) => {
        const updatedColumns = columns.map((column, i) =>
            i === index ? { ...column, title: newTitle } : column
        );
        setColumns(updatedColumns);
    };

    return (
        <div className="customize-overlay">
            <div className="customize-modal">
                <h2>Customize Board</h2>

                {/* Add New Column */}
                <input
                    type="text"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    placeholder="New column name"
                />
                <button onClick={addColumn}>Add Column</button>

                {/* Column List for Reordering */}
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="columns">
                        {(provided) => (
                            <ul className="column-list" ref={provided.innerRef} {...provided.droppableProps}>
                                {columns.map((column, index) => (
                                    <Draggable key={column.id} draggableId={column.id} index={index}>
                                        {(provided) => (
                                            <li
                                                className="column-item"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <input
                                                    type="text"
                                                    value={column.title}
                                                    onChange={(e) => renameColumn(index, e.target.value)}
                                                />
                                            </li>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>

                {/* Close button */}
                <button className="close-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default CustomizeColumnsModal;
