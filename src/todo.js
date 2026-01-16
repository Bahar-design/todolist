// dynamically create todo-items with a factory function

// Todos manage their own INDIVIDUAL state.
export default function createToDo (title, description, dueDate, priority) {
    const id = crypto.randomUUID(); // create an ID for each individual 'todo'

    let completed = false;

    const toggleComplete = () => {
        completed = !completed; //flips the value
    };

    const updateDetails = (changes) => {
    // Change only the fields that include new values
        if (changes.title !== undefined) title = changes.title;
        if (changes.description !== undefined) description = changes.description;
        if (changes.dueDate !== undefined) dueDate = changes.dueDate;
        if (changes.priority !== undefined) priority = changes.priority;
    }

    return { 
        id, 
        get title() { return title; }, //exposing as read-only getter for encapsulation
        get description() { return description; }, 
        get dueDate() { return dueDate; }, 
        get priority() { return priority; },
        get completed() { return completed; },
        toggleComplete,
        updateDetails,
    };
}