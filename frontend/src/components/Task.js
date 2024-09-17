import React from 'react';
import './Task.css';

const Task = ({ title }) => {
    return (
        <div className="task">
            {title}
        </div>
    );
};

export default Task;
