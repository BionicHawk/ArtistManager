import * as ProjectController from "../../wailsjs/go/controllers/ProjectController"
import { dto, models } from "../../wailsjs/go/models";

export default class ProjectEndpoints {

    /**
     * Creates a project binded to a users
     * @param userId 
     * @param projectCreate 
     * @returns a `CreateProjectResult` enumerator which will help yout to handle Ok and Error results
     */
    public async CreateProject(userId: number, projectCreate: dto.ProjectCreate): Promise<{ result: CreateProjectResult, projectId: number | null }> {
        let result = CreateProjectResult.OK;
        let projectId: number | null = null;

        try {
            const petitionResult = await ProjectController.CreateProject(userId, projectCreate);

            // Desestructurar el objeto petitionResult para obtener result y projectId
            const { result: petitionResultStatus, projectId: createdProjectId } = petitionResult;

            switch (petitionResultStatus) {
                case "OK":
                    result = CreateProjectResult.OK;
                    projectId = createdProjectId;
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
                default:
                    result = CreateProjectResult.ERROR;
                    break;
            }
        } catch (error) {
            console.error('Error creating project:', error);
            result = CreateProjectResult.ERROR;
        }

        return { result, projectId };
    }

    /**
     * Create a task binded to a user project
     * @param userId 
     * @param projectId 
     * @param taskCreate 
     * @returns 
     */
    public async AddTask(userId: number, projectId: number, taskCreate: dto.TaskCreate): Promise<AddTaskResult> {
        let result = AddTaskResult.OK;

        console.log({  userId, projectId, taskCreate });

        await ProjectController.AddTask(userId, projectId, taskCreate)
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

    public async GetById(projectId: number): Promise<dto.ProjectDtoOut | null> {
        let project: dto.ProjectDtoOut | null = null;

        await ProjectController.GetById(projectId)
            .then(projectResult => {
                project = projectResult;
            })

        return project;
    }
    
    /**
     * Get all projects from referenced User
     * @param userId 
     */
    public async GetFromUser(userId: number): Promise<Array<models.Project>> {
        let projects: Array<models.Project> = []

        await ProjectController.GetFromUser(userId)
            .then(projectsResult => {
                projects = [...projects, ...projectsResult];
            })

        return projects;
    }

    public async GetProjectWithUser(projectId: number): Promise<dto.UserProjectDtoOut | null> {
        const project = await ProjectController.GetWithUserById(projectId);

        if (!project) {
            return null;
        }
        
        return project;
    }

    /**
     * Search projects by search term
     * @param searchTerm 
     * @returns 
     */
    public async GetProjectsBySearchName(searchTerm: string): Promise<Array<models.Project>> {
        let projects: Array<models.Project> = [];

        await ProjectController.GetProjectsBySearchName(searchTerm)
            .then(projectsResult => {
                projects = [...projects, ...projectsResult];
            })

        return projects;
    }
    
    public async MarkAsDone(userId: number, projectId: number): Promise<MarkAsDoneResult> {
        let result = MarkAsDoneResult.OK;

        await ProjectController.MarkAsDone(userId, projectId)
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

    public async GetAllProjects(): Promise<Array<models.Project>> {
        let projects: Array<models.Project> = [];

        await ProjectController.GetAllProjects()
            .then(projectsResult => {
                projects = [...projects, ...projectsResult];
            })

        return projects;
    }

    public async GetProjectTasks(projectId: number): Promise<Array<models.Task>> {
        let tasks: Array<models.Task> = [];

        await ProjectController.GetProjectTasks(projectId)
            .then(tasksResult => {
                tasks = [...tasks, ...tasksResult];
            })

        return tasks;
    }

    public async DeleteProject(projectId: number): Promise<DeleteProjectResult> {
        let result: DeleteProjectResult;
        let response: string;

        response = await ProjectController.DeleteProject(projectId)

        result = DeleteProjectResult[response as keyof typeof DeleteProjectResult];

        return result;
    }

    public async UpdateProject(projectId: number, userId: number, name: string, description: string): Promise<CreateProjectResult> {
        let result: CreateProjectResult;
        let response: string;

        response = await ProjectController.UpdateProject(userId, {projectId, userId: 0, name, description});

        result = CreateProjectResult[response as keyof typeof CreateProjectResult];

        return result;
    }

    public async UpdateTask(taskId: number, activityName: string): Promise<AddTaskResult> {
        let result: AddTaskResult;
        let response: boolean;

        response = await ProjectController.UpdateTask(taskId, activityName);

        result = response ? AddTaskResult.OK : AddTaskResult.INVALID_NAME;

        return result;
    }

    public async CompleteTask(taskId: number): Promise<any> {
        let result;

        result = await ProjectController.CompleteTask(taskId);

        return result;
    }
}

export enum CreateProjectResult {
    OK,
    NOT_CREATED_DUPLICATE,
    INVALID_DESCRIPTION_LENGTH,
    EMPTY_NAME,
    USER_NOT_FOUND,
    ERROR
}

export enum MarkAsDoneResult {
    OK,
    ALREADY_MARKED,
    NOT_PROJECT_OWNER,
    PROJECT_NOT_FOUND,
    USER_NOT_FOUND
}

export enum DeleteProjectResult {
    OK,
    PROJECT_NOT_FOUND,
    USER_NOT_FOUND,
    ERROR
}

export enum AddTaskResult {
    OK,
    INVALID_NAME,
    PROJECT_NOT_FOUND,
    USER_NOT_FOUND
}