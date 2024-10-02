import taskService from '../services/taskService.js';

const reorderTasksInSameColumn = (columns, source, destination) => {
    const sourceColumn = columns.find(column => column.id === source.droppableId);
    const newTasks = Array.from(sourceColumn.tasks);

    const [movedTask] = newTasks.splice(source.index, 1);
    newTasks.splice(destination.index, 0, movedTask);

    const reorderedTasks = newTasks.map((task, index) => ({
        ...task,
        orderIndex: index,
    }));

    return columns.map(column =>
        column.id === sourceColumn.id ? { ...column, tasks: reorderedTasks } : column
    );
};

const moveTaskBetweenColumns = (columns, source, destination) => {
    const sourceColumn = columns.find(column => column.id === source.droppableId);
    const destinationColumn = columns.find(column => column.id === destination.droppableId);

    const sourceTasks = Array.from(sourceColumn.tasks);
    const destinationTasks = Array.from(destinationColumn.tasks);

    const [movedTask] = sourceTasks.splice(source.index, 1);
    destinationTasks.splice(destination.index, 0, movedTask);

    const updatedSourceTasks = sourceTasks.map((task, index) => ({ ...task, orderIndex: index }));
    const updatedDestinationTasks = destinationTasks.map((task, index) => ({ ...task, orderIndex: index }));

    return columns.map(column => {
        if (column.id === sourceColumn.id) {
            return { ...column, tasks: updatedSourceTasks };
        } else if (column.id === destinationColumn.id) {
            return { ...column, tasks: updatedDestinationTasks };
        }
        return column;
    });
};

const handleTaskUpdateInBackend = (movedTask, columnId, orderIndex) => {
    const updatedTask = {
        ...movedTask,
        columnId: columnId,
        orderIndex: orderIndex
    };
    return taskService.updateTask(movedTask.id, updatedTask);
};

export { reorderTasksInSameColumn, moveTaskBetweenColumns, handleTaskUpdateInBackend };
