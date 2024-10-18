import { Add, KeyboardArrowDown, Settings, } from "@mui/icons-material"
import { Button, Collapse, IconButton, LinearProgress, TextField } from "@mui/material"
import { Project } from "../../interfaces"
import { ProjectCard } from "../../components"

// Datos de ejemplo
const projects: Project[] = [
  {
    id: 1,
    name: "Proyecto A",
    description: "Este es un proyecto de ejemplo con una descripción que no excede los 500 caracteres.",
    taskCount: 10,
    progress: 75,
    createdAt: "2023-01-15",
    completedAt: null,
    assignedUser: "Juan Pérez",
    tasks: ["Tarea 1", "Tarea 2", "Tarea 3"]
  },
  {
    id: 2,
    name: "Proyecto B",
    description: "Otro proyecto de ejemplo con una descripción corta.",
    taskCount: 5,
    progress: 100,
    createdAt: "2023-02-20",
    completedAt: "2023-05-10",
    assignedUser: "María García",
    tasks: ["Tarea 1", "Tarea 2"]
  },
  // Añade más proyectos aquí...
]


export const Projects = () => {
	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 32, alignItems: 'center', }}>
				<h1 className='title'>Proyectos</h1>
				<Button variant='contained' size='small' startIcon={<Add />}>Crear</Button>
			</div>

			<br />

			<div style={{ display: 'flex', gap: 16, flexDirection: 'column', }}>
				{ projects.map( project => (
					<ProjectCard key={ project.id } project={ project } />
				) ) }
			</div>
		</>
	)
}
