import ProjectController from "../../wailsjs/go/controllers/ProjectController"
import { dto, models } from "../../wailsjs/go/models";

export default class ProjectEndpoints {

    /**
     * Creates a project binded to a users
     * @param userId 
     * @param projectCreate 
     * @returns a `CreateProjectResult` enumerator which will help yout to handle Ok and Error results
     */
    public CreateProject(userId: number, projectCreate: dto.ProjectCreate): CreateProjectResult {
        let result = CreateProjectResult.OK;
        
        ProjectController.CreateProject(userId, projectCreate)
            .then(petitionResult => {
                switch (petitionResult) {
                    case "OK":
                        result = CreateProjectResult.OK;
                        break;
                    case "EMPTY_NAME":
                        result = CreateProjectResult.EMPTY_NAME;
                        break;
                    case "INVALID_DESCRIPTION_LENGTH":
                        result = CreateProjectResult.INVALID_DESCRIPTION_LENGTH;
                        break;
                    case "NOT_CREATED_DUPLICATE":
                        result = CreateProjectResult.NOT_CREATED_DUPLICATE;
                        break;
                    case "USER_NOT_FOUND":
                        result = CreateProjectResult.USER_NOT_FOUND;
                        break; 
                }
            })

        return result;
    }

    /**
     * Create a task binded to a user project
     * @param userId 
     * @param projectId 
     * @param taskCreate 
     * @returns 
     */
    public AddTask(userId: number, projectId: number, taskCreate: dto.TaskCreate): AddTaskResult {
        let result = AddTaskResult.OK;

        ProjectController.AddTask(userId, projectId, taskCreate)
            .then(taskResult => {
                switch (taskResult) {
                    case "OK":
                        result = AddTaskResult.OK;
                        break;
                    case "INVALID_NAME":
                        result = AddTaskResult.INVALID_NAME;
                        break;
                    case "PROJECT_NOT_FOUND":
                        result = AddTaskResult.PROJECT_NOT_FOUND;
                        break;
                    case "USER_NOT_FOUND":
                        result = AddTaskResult.USER_NOT_FOUND;
                        break;
                }
            })

        return result;
    } 
    
    /**
     * Get all projects from referenced User
     * @param userId 
     */
    public GetFromUser(userId: number): Array<models.Project> {
        let projects: Array<models.Project> = []

        ProjectController.GetFromUser(userId)
            .then(projectsResult => {
                projects = [...projects, ...projectsResult];
            })

        return projects;
    }

    /**
     * Search projects by search term
     * @param searchTerm 
     * @returns 
     */
    public GetProjectsBySearchName(searchTerm: string): Array<models.Project> {
        let projects: Array<models.Project> = [];

        ProjectController.GetProjectsBySearchName(searchTerm)
            .then(projectsResult => {
                projects = [...projects, ...projectsResult];
            })

        return projects;
    }
    
    public MarkAsDone(userId: number, projectId: number): MarkAsDoneResult {
        let result = MarkAsDoneResult.OK;

        ProjectController.MarkAsDone(userId, projectId)
            .then(markResult => {
                switch (markResult) {
                    case "OK":
                        result = MarkAsDoneResult.OK;
                        break;
                    case "ALREADY_MARKED":
                        result = MarkAsDoneResult.ALREADY_MARKED;
                        break;
                    case "NOT_PROJECT_OWNER":
                        result = MarkAsDoneResult.NOT_PROJECT_OWNER;
                        break;
                    case "PROJECT_NOT_FOUND":
                        result = MarkAsDoneResult.PROJECT_NOT_FOUND;
                        break;
                    case "USER_NOT_FOUND":
                        result = MarkAsDoneResult.USER_NOT_FOUND;
                        break;
                }
            });

        return result;
    }

}

export enum CreateProjectResult {
    OK,
    NOT_CREATED_DUPLICATE,
    INVALID_DESCRIPTION_LENGTH,
    EMPTY_NAME,
    USER_NOT_FOUND
}

export enum MarkAsDoneResult {
    OK,
    ALREADY_MARKED,
    NOT_PROJECT_OWNER,
    PROJECT_NOT_FOUND,
    USER_NOT_FOUND
}

export enum AddTaskResult {
    OK,
    INVALID_NAME,
    PROJECT_NOT_FOUND,
    USER_NOT_FOUND
}