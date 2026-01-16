import createToDo from "./todo.js";
import createProject from "./project.js";
import manageProjects from "./managers/projectManager.js";
//import from "./dom.js";

//index is focused on initialization! Use factories to create the default project structure!

const defaultProject = createProject("Default Project"); //only need to pass in a title
const initialToDo = createToDo("Workout", "Finish an intensive workout today.", new Date().toISOString(), "high"); //passes in todo title, desc, duedate, & priority

defaultProject.addToDo(initialToDo); //use addtodo function from project.js & pass initial todo

const projManager = manageProjects();
projManager.addProject(defaultProject); // use a variable to call manageProjects & use its method