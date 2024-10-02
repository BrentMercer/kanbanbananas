import React, { useEffect, useState } from 'react';
import './TaskDetailModal.css';

const TaskDetailModal = ({ task, onClose, onEdit, onDelete }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDetails, setEditedDetails] = useState(task.details);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

    useEffect(() => {
        setEditedTitle(task.title);
        setEditedDetails(task.details);
    }, [task]);

    const handleSave = async  () => {
        if (!editedTitle.trim() || !editedDetails.trim()) {
            alert("Task title and details cannot be empty.");
            return;
        }
        const updatedTask = { ...task, title: editedTitle, details: editedDetails };
        console.log("Saving task with updated details:", updatedTask);
        await onEdit(updatedTask);
        onClose();
    };


    // Handle task deletion
    const handleDelete = () => {
        setIsConfirmDeleteOpen(true);
    };

    const confirmDelete = () => {
        onDelete(task.id);
        onClose();
    };

    return (
        <div className="task-detail-overlay">
            <div className="task-detail-modal">
                {isEditMode ? (
                    <>
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="new-task-modal-input"
                        />
                        <textarea
                            value={editedDetails}
                            onChange={(e) => setEditedDetails(e.target.value)}
                            className="new-task-modal-textarea"
                        />
                    </>
                ) : (
                    <>
                        <h2>{task.title}</h2>
                        <p className="task-details">{task.details}</p>
                    </>
                )}



                <div className="button-group">
                    {isEditMode ? (
                        <button onClick={handleSave}>Save</button>
                    ) : (
                        <button onClick={() => setIsEditMode(true)}>Edit</button>
                    )}
                    <button>Placeholder</button>
                    <button onClick={handleDelete}>Delete Task</button>
                </div>

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
