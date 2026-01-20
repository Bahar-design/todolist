//index is focused on initialization! Use factories to create the default project structure!
import createToDo from "./todo.js";
import createProject from "./managers/project.js";
import manageProjects from "./managers/projectManager.js";
import { showTodoForm, renderProjects, renderTodos, handleProjectClicks, handleTodoClicks } from "./dom.js";
import { saveProjects, loadProjects } from "./storage.js";

const projectManager = manageProjects();

const savedProjects = loadProjects(); //tries to read from localStorage

let activeProjectId;

if (savedProjects) { //runs after every refresh
    savedProjects.forEach(savedProject => {
        const project = createProject(savedProject.title); //rebuild each project

        savedProject.toDos.forEach(savedTodo => {
            const todo = createToDo(savedTodo.title, savedTodo.description, savedTodo.dueDate, savedTodo.priority); //rebuild each to-do

            if (savedTodo.completed) { //completed is in private state, can't be restored directly
                todo.toggleComplete(); //restore through method behavior
            }
            project.addToDo(todo);
        });
        projectManager.addProject(project);
    });

    activeProjectId = projectManager.projects[0].projectId; //selects first project automatically
} else {
    //if no saved data exists (initial app load), create starter project & to-do
    const defaultProject = createProject("Default Project");
    const initialToDo = createToDo("Workout", "Finish an intensive workout today.", new Date().toISOString(), "high");

    defaultProject.addToDo(initialToDo);
    projectManager.addProject(defaultProject);

    activeProjectId = defaultProject.projectId;
}

function renderApp() { //function called after every change
    const projects = projectManager.projects;
    const activeProject = projectManager.findProjectById(activeProjectId);

    renderProjects(projects, activeProjectId); //updates dom only
    renderTodos(activeProject);
}

handleProjectClicks(projectId => { //after click event, app state updates and UI re-renders
    activeProjectId = projectId;
    renderApp();
});

handleTodoClicks((todoId, action) => {
    const project = projectManager.findProjectById(activeProjectId);
    const todo = project.findToDoById(todoId);

    if (action === "delete") {
        project.deleteToDo(todoId);
        persist(); //call persist after any mutation
        renderApp();
        return;
    }

    if (action === "toggle") {
        todo.toggleComplete();
        persist();
        renderApp();
        return;
    }

    if (e.target.dataset.edit) {
        showTodoForm((data) => {
            todo.updateDetails(data);
            persist();
            renderApp();
        }, todo);
    }
});

//add project behavior
const newProjectBtn = document.getElementById('new-project-btn');
newProjectBtn.addEventListener("click", () => {
    const title = prompt("Project name:");
    if (!title) return;

    const project = createProject(title);
    projectManager.addProject(project);

    activeProjectId = project.projectId; //automatically selects new project
    persist();
    renderApp(); //redraws UI
});

//add to-do behavior inside current project
const newToDoBtn = document.getElementById('new-todo-btn');
newToDoBtn.addEventListener("click", () => {
    showTodoForm((data) => {
        const project = projectManager.findProjectById(activeProjectId);

        const newToDo = createToDo(data.title, data.description, data.dueDate, data.priority);

        project.addToDo(newToDo);
        persist();
        renderApp();
    });
});

function persist() {
    saveProjects(projectManager.projects);
}

renderApp(); //initial render to show UI on page load