import { Typography } from "@mui/material";
import InfoCard from "./components/InfoCard/InfoCard";
import Styles from "./Home.module.css";
import { dto, models } from "../../../wailsjs/go/models";
import { useEffect, useState } from "react";
import ProjectEndpoints from "../../api/ProjectEndpoints";
import ProjectChip from "./components/ProjectChip/ProjectChip";

export const Home = () => {
	const ProjectController = new ProjectEndpoints();
	
	const [projects, setProjects] = useState<models.Project[]>([]);

	useEffect(() => {
		ProjectController.GetAllProjects()
			.then(projectsResponse => {
				setProjects(projectsResponse.filter(p => 
					p.endedAt.Valid === false && p.deletedAt.Valid === false));
				console.log(projects);	
			})
			.catch(err => {
				console.log(err);
			})
	}, [])

	return (
		<div>
			<Typography variant="h5">Inicio</Typography>
			<section className={Styles.InfoSection}>
				<InfoCard label="Proyectos activos">
					<ProjectSection projects={projects}/>
				</InfoCard>
				<InfoCard label="Tareas recientes"></InfoCard>
				<InfoCard label="Últimos usuarios creados"></InfoCard>
				<InfoCard label="Accesos directos"></InfoCard>
			</section>
		</div>
	)
}

const ProjectSection = (props: { projects: models.Project[] }) => {
	return <div>
		{
			props.projects.map(p => (<ProjectChip key={p.id} project={p}/>))
		}
	</div>
}

