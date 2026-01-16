export default function manageProjects() {
    let projects = [];
    
    const addProject = (project) => {
        projects.push(project);
        return project;
    };
    
    const findProjectById = (projId) => {
        return projects.find(project => project.projectId === projId);
    };
    
    const deleteProject = (projId) => {
        const index = projects.findIndex(project => project.projectId === projId);
        if (index !== -1) {
            projects.splice(index, 1);
        }
    };

    //const setCurrentProject = (id) => {};

    //const getCurrentProject = () => {};

    return {
        addProject,
        findProjectById,
        deleteProject,
        get projects() { return [...projects]; }, //return copy of list of projects
    };
};