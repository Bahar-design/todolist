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
                    <option value="low" ${existingTodo?.priority === "low" ? "selected" : ""}>Low</option>
                    <option value="medium" ${existingTodo?.priority === "medium" ? "selected" : ""}>Medium</option>
                    <option value="high" ${existingTodo?.priority === "high" ? "selected" : ""}>High</option>
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
        wrapper.dataset.priority = todo.priority;
        wrapper.classList.add("todo-item");

        const content = document.createElement("div");
        content.classList.add("todo-content");

        const header = document.createElement("div");
        header.classList.add("todo-header");

        const titleSpan = document.createElement("span");
        titleSpan.classList.add("todo-title");
        titleSpan.textContent = todo.title;

        if (todo.completed) {
            text.style.textDecoration = "line-through";
            text.style.opacity = "0.6";
        }

        const dueDate = document.createElement("span");
        dueDate.classList.add("todo-date");
        if (todo.dueDate) {
            const date = new Date(todo.dueDate);
            dueDate.textContent = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }

        header.append(titleSpan, dueDate);

        // Details section (initially hidden)
        const details = document.createElement("div");
        details.classList.add("todo-details");
        details.style.display = "none";

        const description = document.createElement("p");
        description.classList.add("todo-description");
        description.textContent = todo.description || "No description";

        const priorityBadge = document.createElement("span");
        priorityBadge.classList.add("priority-badge");
        priorityBadge.textContent = `Priority: ${todo.priority}`;
        priorityBadge.dataset.priority = todo.priority;

        details.append(description, priorityBadge);

        content.append(header, details);

        const actions = document.createElement("div");
        actions.classList.add("todo-actions");

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.dataset.action = "edit";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.dataset.action = "delete";

        actions.append(editBtn, deleteBtn);

        wrapper.append(content, actions);
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
            return;
        }
        
        if (action === "delete") {
            onTodoAction(todoId, "delete");
            return;
        }

        if (!action) { //if clicking on content area (not buttons), then toggle details
            const details = todoElement.querySelector(".todo-details");
            if (details.style.display === "none") {
                details.style.display = "block";
                todoElement.classList.add("expanded");
            } else {
                details.style.display = "none";
                todoElement.classList.remove("expanded");
            }
        }
    });
}

export {
    renderProjects,
    renderTodos,
    handleProjectClicks,
    handleTodoClicks,
};