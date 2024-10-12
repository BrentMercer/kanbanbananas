import React, { useState } from 'react';
import './CustomizeColumnsModal.css';
import axios from 'axios';

const CustomizeColumnsModal = ({ columns, setColumns, onClose }) => {
    const [newColumnName, setNewColumnName] = useState('');

    // Function to handle adding a new column
    const addColumn = async () => {
        if (newColumnName.trim()) {
            try {
                const columnData = { title: newColumnName, orderIndex: columns.length };
                const response = await axios.post(`/boards/1/board_columns`, columnData); // Replace `1` with your board ID
                setColumns([...columns, response.data]);
                setNewColumnName('');
            } catch (error) {
                console.error("Error adding column:", error);
            }
        }
    };

    // Function to handle renaming a column
    const renameColumn = async (index, newTitle) => {
        const columnToRename = columns[index];
        if (newTitle.trim() && columnToRename.title !== newTitle) {
            try {
                const updatedColumn = { ...columnToRename, title: newTitle };
                await axios.put(`/board_columns/${columnToRename.id}`, updatedColumn);
                const updatedColumns = columns.map((column, i) =>
                    i === index ? { ...column, title: newTitle } : column
                );
                setColumns(updatedColumns);
            } catch (error) {
                console.error("Error renaming column:", error);
            }
        }
    };

    // Function to handle deleting a column
    const deleteColumn = async (columnId) => {
        try {
            await axios.delete(`/board_columns/${columnId}`);
            const updatedColumns = columns.filter(column => column.id !== columnId);
            setColumns(updatedColumns);
        } catch (error) {
            console.error("Error deleting column:", error);
        }
    };

    // Function to handle saving all changes and closing the modal
    const handleSaveAndClose = async () => {
        try {
            onClose(); // Close the modal after saving
        } catch (error) {
            console.error("Error saving columns:", error);
        }
    };

    return (
        <div className="customize-overlay">
            <div className="customize-modal">
                <h2>Customize Columns</h2>

                {/* Add New Column */}
                <input
                    type="text"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    placeholder="New column name"
                />
                <button onClick={addColumn}>Add Column</button>

                {/* Display Current Columns */}
                <ul className="column-list">
                    {columns.map((column, index) => (
                        <li key={column.id} className="column-item">
                            <input
                                type="text"
                                value={column.title}
                                onChange={(e) => renameColumn(index, e.target.value)}
                                placeholder="Column title"
                            />
                            <button onClick={() => deleteColumn(column.id)}>Delete</button>
                        </li>
                    ))}
                </ul>

                {/* Save and Close Button */}
                <button onClick={handleSaveAndClose} className="close-button">Save and Close</button>
            </div>
        </div>
    );
};

export default CustomizeColumnsModal;
