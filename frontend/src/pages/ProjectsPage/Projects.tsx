import { Circle } from "@mui/icons-material"
import { Button, Card, CardActionArea, CardContent, CircularProgress, Container, Icon, Typography } from "@mui/material"
import { CSSProperties, useEffect, useState } from "react"
import { dto, models } from "../../../wailsjs/go/models"
import { Link } from "react-router-dom"
import { useUserStore } from "../../store/useUserStore"
import ProjectEndpoints from "../../api/ProjectEndpoints"
import ProgressIndicatorTag from "../../components/ProgressIndicatorTag/ProgressIndicatorTag"

export const Projects = () => {
	const [loading, setLoading] = useState(true);
	const [projects, setProjects] = useState<models.Project[]>([]);
	const { user } = useUserStore();

	const projectEndpoints = new ProjectEndpoints();

	function ProjectsHeader() {
		return <div>
			<h2>Proyectos</h2>
		</div>
	}

	useEffect(() => {
		if (!user) {
			return;
		}
		projectEndpoints.GetFromUser(user.id)
			.then(projects => {
				setProjects(projects);
				setLoading(false);

			})
			.catch(err => {
				console.error(err);
			})
	}, [])

	if (loading) {
		return <div>
			<CircularProgress />
		</div>
	}

	return (
		<div style={pageStyles}>
			<ProjectsHeader />
			<div style={projectsContainerStyles}>
				{projects.map(project => (<ProjectItem key={project.id} project={project} />))}
			</div>
		</div>
	)
}

function ProjectItem({project}: {project: models.Project}) {
	const description = project.description.String ?? "";

	return <Card className='emergable' sx={{width: '100%', backgroundColor: '#404040'}}
		variant="elevation" elevation={8}>
		<CardContent>
			<Typography variant="h5">{project.name}</Typography>
			<Typography variant="body2" paddingY={1.5} align="left">{description}</Typography>
			<ProgressIndicatorTag progressType={project.endedAt.Valid ? 'Terminado' : 'Pendiente' }/>
		</CardContent>
		<CardActionArea>
			<Link to={`/project/${project.id}`}>
				<Typography variant="overline" color="textSecondary">Ver más</Typography>
			</Link>
		</CardActionArea>
	</Card>
}

const pageStyles: CSSProperties = {
	display: 'grid', 
	gridTemplateRows: 'auto 1fr', 
	height: '100%'
}

const projectsContainerStyles: CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
	flexWrap: 'wrap',
	alignItems: 'center',
	margin: '8px',
	flexGrow: 1,
	overflowY: 'auto',
}
