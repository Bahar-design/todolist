// dynamically create projects with a factory function

// Projects manage COLLECTIONS of todos
export default function createProject (title) {
    const projectId = crypto.randomUUID(); //unique id for projects to delete?

    let toDos = [];

    const findToDoById = (id) => {
        // use find method to loop through all todos in a project and find a matching ID 
        return toDos.find(todo => todo.id === id);
    }

    const addToDo = (todoItem) => {
        toDos.push(todoItem);
    };

    const updateProjectTodo = (toDoID, changes) => {
        //a helper that delegates and calls the function to update a found todo from todo.js
        const todo = findToDoById(toDoID);
        if (todo) {
            todo.updateDetails(changes);
        }
    };

    const deleteToDo = (todoId) => {
        const index = toDos.findIndex(todo => todo.id === todoId); // the findtodobyid method returns the todo object itself, but we must find the INDEX 
        if (index !== -1) {
            toDos.splice(index, 1);
        }
    };

    return {
        projectId,
        title,
        get toDos() { return [...toDos]; }, //return copy of list of todos
        findToDoById,
        addToDo,
        updateProjectTodo,
        deleteToDo,
    };
}