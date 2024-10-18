export interface Project {
	id: number;
	name: string;
	description: string;
	taskCount: number;
	progress: number;
	createdAt: string;
	completedAt: string | null;
	assignedUser: string;
	tasks: string[];
}