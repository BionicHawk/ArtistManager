import { dto } from "../../wailsjs/go/models";
import * as TaskController from "../../wailsjs/go/controllers/TaskController";

export default class TaskEndpoints {

    public async GetRecentTasks(days: number): Promise<Task[]> {
        const tasks = Array<Task>();

        await TaskController.GetRecentsTasks(days)
            .then(tasksResponse => {
                console.log(tasksResponse);

                for (let i = 0; i < tasksResponse.length; ++i) {
                    const taskDto = tasksResponse[i];
                    const task = new Task(taskDto);
                    tasks.push(task);
                }

            })

        return tasks;
    }

}

export class Task {
    id: number;
    activityName: string;
    description?: string;
    status: string;
    createdAt: Date;
    endedAt?: Date;
    project: string;

    constructor(fromDto: dto.TaskDtoOut) {
        this.id = fromDto.id;
        this.activityName = fromDto.activityName;
        this.description = fromDto.description;
        this.status = fromDto.status;
        this.createdAt = new Date(fromDto.createdAt);
        this.endedAt = fromDto.endedAt ? new Date(fromDto.endedAt) : undefined;
        this.project = fromDto.project;
    }
}