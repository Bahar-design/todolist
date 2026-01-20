const projectsContainer = document.getElementById("projects-container");
const todosContainer = document.getElementById("todos-container");
const title = document.getElementById("current-project-title");
const modalContainer = document.getElementById("modal-container");

export function showTodoForm(onSubmit, existingTodo = null) {
    modalContainer.innerHTML = `
        <form id="todo-form" class="modal">
            <label>
                Title
                <input type="text" id="todo-title" required value="${existingTodo?.title ?? ""}">
            </label>

            <label>
                Description
                <textarea id="todo-description">${existingTodo?.description ?? ""}</textarea>
            </label>

            <label>
                Due Date
                <input type="date" id="todo-date" value="${existingTodo?.dueDate?.slice(0,10) ?? ""}">
            </label>

            <label>
                Priority
                <select id="todo-priority">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </label>

            <button type="submit">Save</button>
            <button type="button" id="cancel-btn">Cancel</button>
        </form>
    `;

    const form = document.getElementById("todo-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const data = {
            title: document.getElementById("todo-title").value,
            description: document.getElementById("todo-description").value,
            dueDate: document.getElementById("todo-date").value,
            priority: document.getElementById("todo-priority").value,
        };

        onSubmit(data);
        modalContainer.innerHTML = "";
    });

    document.getElementById("cancel-btn")
        .addEventListener("click", () => modalContainer.innerHTML = "");
}


function renderProjects(projects, activeProjectId) {
    projectsContainer.innerHTML = ""; //clearing existing project elements

    projects.forEach(project => {
        const div = document.createElement("div"); //creating dom element for each project
        div.textContent = project.title;
        div.dataset.id = project.projectId; //stores project id inside DOM

        if (project.projectId === activeProjectId) {
            div.classList.add("active"); //reflecting the UI and the app's state
        }

        projectsContainer.appendChild(div); //project added to sidebar
    });
}

function renderTodos(project) {
    title.textContent = project.title;
    todosContainer.innerHTML = "";

    project.toDos.forEach(todo => {
        const wrapper = document.createElement("div");
        wrapper.dataset.id = todo.id;
        wrapper.classList.add("todo-item");

        const text = document.createElement("span");
        text.textContent = todo.title;

        if (todo.completed) {
            text.style.textDecoration = "line-through";
        }

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.dataset.action = "edit";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.dataset.action = "delete";

        wrapper.append(text, editBtn, deleteBtn);
        todosContainer.appendChild(wrapper);
    });
}

function handleProjectClicks(onProjectSelect) {
    projectsContainer.addEventListener("click", e => { //event delegation (one listener for all project clicks)
        const project = e.target.closest("div"); //finding the project that was clicked on
        if (!project) return;
        onProjectSelect(project.dataset.id); //calling application logic
    });
}

function handleTodoClicks(onTodoAction) {
    todosContainer.addEventListener("click", e => {
        const todoElement = e.target.closest(".todo-item");
        if (!todoElement) return;

        const todoId = todoElement.dataset.id;
        const action = e.target.dataset.action;

        if (action === "edit") {
            onTodoAction(todoId, "edit");
        } else if (action === "delete") {
            onTodoAction(todoId, "delete");
        } else {
            onTodoAction(todoId, "toggle"); //clicking on text toggles completion
        }
    });
}

export {
    renderProjects,
    renderTodos,
    handleProjectClicks,
    handleTodoClicks,
};