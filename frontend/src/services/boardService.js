import axiosInstance from "./axiosInstance";

export const getBoardById = async (boardId) => {
    try {
        const response = await axiosInstance.get(`/boards/${boardId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching board with ID ${boardId}:`, error);
        throw error;
    }
};

export default {
    getBoardById,
};
