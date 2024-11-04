import { Typography } from "@mui/material";
import InfoCard from "./components/InfoCard/InfoCard";
import Styles from "./Home.module.css";
import { dto, models } from "../../../wailsjs/go/models";
import { useEffect, useState } from "react";
import ProjectEndpoints from "../../api/ProjectEndpoints";
import ProjectsContainer from "./components/ProjectsContainer/ProjectsContainer";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import TaskEndpoints, { Task } from "../../api/TaskEndpoints";
import TaskContainer from "./components/TaskContainer/TaskContainer";
import UserEndpoints from "../../api/UserEndpoints";
import UsersContainer from "./components/UsersContainer/UsersContainer";

export const Home = () => {
	const ProjectController = new ProjectEndpoints();
	const TaskController = new TaskEndpoints();
	const UserController = new UserEndpoints();

	const [projects, setProjects] = useState<models.Project[]>([]);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [users, setUsers] = useState<dto.UserDtoOut[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchData = async () => {
		try {
			const projectsResponse = await ProjectController.GetAllProjects();
			const tasksResponse = await TaskController.GetRecentTasks(7);
			const usersResponse = await UserController.GetRecentUsers(7);

			setProjects(projectsResponse.filter(p =>
				p.endedAt.Valid === false && p.deletedAt.Valid === false
			));

			setTasks(tasksResponse);
			setUsers(usersResponse);

		} catch (error) {
			console.error(error);
		}

		setLoading(false);
	}

	useEffect(() => {
		fetchData();
	}, [])

	if (loading) {
		return <LoadingScreen message="Cargando..." />
	}

	return (
		<div>
			<Typography variant="h5">Inicio</Typography>
			<section className={Styles.InfoSection}>
				<InfoCard label="Proyectos activos">
					<ProjectsContainer projects={projects}/>
				</InfoCard>
				<InfoCard label="Tareas recientes">
					<TaskContainer tasks={tasks}/>
				</InfoCard>
				<InfoCard label="Últimos usuarios creados">
					<UsersContainer users={users}/>
				</InfoCard>
			</section>
		</div>
	)
}
