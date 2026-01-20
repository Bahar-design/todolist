const STORAGE_KEY = "todo-projects";

function saveProjects(projects) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function loadProjects() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null; //returns null on initial app load, or an array when saved data exists
}

export { saveProjects, loadProjects, };