import axiosInstance from "./axiosInstance";

export const getTasksByColumnId = async (columnId) => {
    try {
        const response = await axiosInstance.get(`/board_columns/${columnId}/tasks`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching tasks for column ${columnId}:`, error);
        throw error; // Ensure to propagate the error
    }
};

export const createTask = async (columnId, newTask) => {
    try {
        const response = await axiosInstance.post(`/board_columns/${columnId}/tasks`, newTask);
        return response.data;
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
};

export const updateTask = async (taskId, updatedTask) => {
    console.log(`Attempting to update task at URL: /tasks/${taskId}`);
    console.log("Task Data being sent:", updatedTask);

    try {
        const response = await axiosInstance.put(`/tasks/${taskId}`, updatedTask);
        console.log("Task updated successfully in the backend:", response.data);
        return response.data;
    } catch (error) {
        console.error(`Error updating task ${taskId}:`, error);
        throw error;
    }
};

export const deleteTask = async (taskId) => {
    try {
        console.log(`Attempting to delete task at URL: /tasks/${taskId}`);
        await axiosInstance.delete(`/tasks/${taskId}`);
    } catch (error) {
        console.error(`Error deleting task ${taskId}:`, error);
        throw error;
    }
};



export const moveTask = async (taskId, newColumnId, newOrderIndex) => {
    try {
        const response = await axiosInstance.put(`/tasks/${taskId}/move`, {
            columnId: newColumnId,
            orderIndex: newOrderIndex,
        });
        return response.data;
    } catch (error) {
        console.error(`Error moving task ${taskId}:`, error);
        throw error;
    }
};

export default {
    getTasksByColumnId,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
};
