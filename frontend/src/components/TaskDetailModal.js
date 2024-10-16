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
        // Remove spaces from beginning and end, and remove double spaces before save.
        const trimmedTitle = editedTitle.trim().replace(/\s+/g, ' ');
        const trimmedDetails = editedDetails.trim().replace(/\s+/g, ' ');
        if (!trimmedTitle || !trimmedDetails) {
            alert("Task title and details cannot be empty.");
            return;
        }
        const updatedTask = { ...task, title: trimmedTitle, details: trimmedDetails };
        console.log("Saving task with updated details:", updatedTask);
        await onEdit(updatedTask);
        onClose();
    };


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
                            maxLength={30}
                            placeholder="Task Title"
                        />
                        <small>{editedTitle.length}/{30}</small>
                        <textarea
                            value={editedDetails}
                            onChange={(e) => setEditedDetails(e.target.value)}
                            className="new-task-modal-textarea"
                            maxLength={1000}
                            placeholder="Task Details"
                        />
                        <small>{editedDetails.length}/{1000}</small>
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
