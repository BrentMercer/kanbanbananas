import React, { useState, useEffect, memo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './NewTaskModal.css';

const NewTaskModal = ({ columnId, addTask, task, onClose  }) => {
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');

    useEffect(() => {
        console.log("Task received in modal:", task);
        if (task) {
            setTitle(task.title || '');
            setDetails(task.details || '');
        } else {
            setTitle('');
            setDetails('');
        }
    }, [task]);




    const handleSaveTask = () => {
        if (title.trim()) {
            if (task) {
                // Edit existing task
                const updatedTask = { ...task, title, details };
                addTask(columnId, updatedTask);
            } else {
                // Create new task with a unique ID
                const newTask = { id: `task-${Date.now()}`, title, details };
                addTask(columnId, newTask);
            }
            onClose();
        }
    };




    return (
        <div className="new-task-overlay">
            <div className="new-task-modal">
                <h2>{task ? 'Edit Task' : 'Add New Task'}</h2>
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
                <button onClick={handleSaveTask}>{task ? 'Save Changes' : 'Add Task'}</button>
                <button className="close-button" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default NewTaskModal;
