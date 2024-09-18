import React, { useState } from 'react';
import './TaskDetailModal.css';

const TaskDetailModal = ({ task, onClose, onEdit, onDelete }) => {
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false); // Manage delete confirmation

    const handleDelete = () => {
        setIsConfirmDeleteOpen(true);
    };

    const confirmDelete = () => {
        onDelete(task.id); // Call the delete function from parent
        onClose(); // Close the modal after deletion
    };

    return (
        <div className="task-detail-overlay">
            <div className="task-detail-modal">
                <h2>{task.title}</h2>
                <p className="task-details">{task.details}</p>

                {/* Right-side buttons */}
                <div className="button-group">
                    <button onClick={() => onEdit(task)}>Edit</button>
                    <button>Placeholder</button> {/* Future feature button */}
                    <button onClick={handleDelete}>Delete Task</button>
                </div>

                {/* Delete confirmation */}
                {isConfirmDeleteOpen && (
                    <div className="confirm-delete">
                        <p>Are you sure you want to delete this task?</p>
                        <button onClick={confirmDelete}>Yes</button>
                        <button onClick={() => setIsConfirmDeleteOpen(false)}>No</button>
                    </div>
                )}

                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default TaskDetailModal;
