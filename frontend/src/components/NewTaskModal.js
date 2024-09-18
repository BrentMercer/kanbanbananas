import React, { useState } from 'react';
import './NewTaskModal.css';

const NewTaskModal = ({ columnId, onClose, addTask }) => {
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');

    const handleAddTask = () => {
        if (title.trim()) {
            addTask(columnId, { id: `task-${Date.now()}`, title, details });
            onClose(); // Close the modal after adding the task
        }
    };

    return (
        <div className="new-task-overlay">
            <div className="new-task-modal">
                <h2>Add New Task</h2>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task Title"
                />
                <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Task Details"
                />
                <button onClick={handleAddTask}>Add Task</button>
                <button className="close-button" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default NewTaskModal;
