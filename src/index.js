//index is focused on initialization! Use factories to create the default project structure!
import createToDo from "./todo.js";
import createProject from "./managers/project.js";
import manageProjects from "./managers/projectManager.js";
import { showTodoForm, renderProjects, renderTodos, handleProjectClicks, handleTodoClicks } from "./dom.js";

const projectManager = manageProjects();

const defaultProject = createProject("Default Project"); //only need to pass in a title
const initialToDo = createToDo("Workout", "Finish an intensive workout today.", new Date().toISOString(), "high"); //passes in todo title, desc, duedate, & priority

defaultProject.addToDo(initialToDo); //use addtodo function from project.js & pass initial todo
projectManager.addProject(defaultProject); // use a variable to call manageProjects & use its method

let activeProjectId = defaultProject.projectId; //tracks currently selected project

function renderApp() { //function called after every change
    const projects = projectManager.projects;
    const activeProject = projectManager.findProjectById(activeProjectId);

    renderProjects(projects, activeProjectId);
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
        renderApp();
        return;
    }

    if (action === "toggle") {
        todo.toggleComplete();
        renderApp();
        return;
    }

    if (action === "edit") {
        showTodoForm((data) => {
            todo.updateDetails(data);
            renderApp();
        }, todo);
    }
});



renderApp(); //initial render to show UI on page load

//add project behavior
const newProjectBtn = document.getElementById('new-project-btn');
newProjectBtn.addEventListener("click", () => {
    const title = prompt("Project name:");
    if (!title) return;

    const project = createProject(title);
    projectManager.addProject(project);

    activeProjectId = project.projectId; //automatically selects new project
    renderApp(); //redraws UI
});

//add to-do behavior inside current project
const newToDoBtn = document.getElementById('new-todo-btn');
newToDoBtn.addEventListener("click", () => {
    showTodoForm((data) => {
        const project = projectManager.findProjectById(activeProjectId);

        const newToDo = createToDo(data.title, data.description, data.dueDate, data.priority);

        project.addToDo(newToDo);
        renderApp();
    });
});