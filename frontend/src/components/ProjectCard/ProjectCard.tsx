import { Button, ButtonBase, Checkbox, Collapse, IconButton, LinearProgress, Menu } from "@mui/material";
import { Project } from "../../interfaces";
import { DeleteOutlined, Done, EditNoteOutlined, KeyboardArrowDown, VisibilityOutlined } from "@mui/icons-material";
import React, { useState } from "react";
import ProjectEndpoints from "../../api/ProjectEndpoints";

interface ProjectCardProps {
	project: Project;
	updateProjects: () => Promise<void>;
	handleEditProject: (project: Project) => void;
	handleCompleteTask: (taskId: number) => void;
}

export const ProjectCard = ({ project, updateProjects, handleEditProject, handleCompleteTask }: ProjectCardProps) => {
	const [showTasks, setShowTasks] = useState( false );
	const [anchorConfirmDeleteEle, setAnchorConfirmDeleteEle] = useState<null | HTMLElement>(null);
  const openConfirmDelete = Boolean(anchorConfirmDeleteEle);

	const projectEndpoints = new ProjectEndpoints();

	const handleToggleShowTasks = () => {
		setShowTasks( !showTasks );
	}

	const onDeleteProject = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorConfirmDeleteEle( event.currentTarget );
	};

	const handleCloseConfirmDelete = () => {
    setAnchorConfirmDeleteEle( prev => null );
  };

	// const onEditProject = async (projectId: number) => {
	// 	const response = await projectEndpoints.GetById( projectId );

	// 	console.log({ response });
	// }

	const onConfirmDelete = async () => {
		console.log({ anchorConfirmDeleteEle });
		handleCloseConfirmDelete();
		await projectEndpoints.DeleteProject( project.id );
		await updateProjects();
	};

	return (
		<div
			style={{
				backgroundColor: 'rgba(255, 255, 255, 0.1)',
				padding: 24,
				borderRadius: 8,
				boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.2)',
				display: 'flex',
				flexDirection: 'column',
				gap: 8,
			}}
			>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 8,
				}}
			>
				<span
					style={{
						fontSize: '1.5rem',
						fontWeight: 'bold',
					}}
				>{ project.name }</span>
				<div
					style={{
						display: 'flex',
						gap: 8
					}}
				>
					{/* <SquareButton icon={<VisibilityOutlined style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.8)' }} />} onClick={ () => console.log( 'Ver detalles' ) } /> */}
					<SquareButton icon={<EditNoteOutlined style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.8)' }} />} onClick={ () => handleEditProject( project ) } />
					<SquareButton icon={<DeleteOutlined style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.8)' }} />} onClick={ onDeleteProject } />
					<Menu
						id="basic-menu"
						anchorEl={anchorConfirmDeleteEle}
						open={openConfirmDelete}
						onClose={handleCloseConfirmDelete}
						MenuListProps={{
							'aria-labelledby': 'basic-button',
						}}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'center',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
					>
						<p style={{ fontSize: '0.8rem', padding: '0 8px' }}>¿Está seguro de eliminar este registro?</p>
						<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '0 8px' }}>
							<button onClick={ onConfirmDelete } style={{ fontSize: '0.8rem', padding: '4px 8px', backgroundColor: 'inherit', borderRadius: 16, color: '#ff6e6e', border: '1px solid #ff6e6e', cursor: 'pointer' }}>Eliminar</button>
							<button onClick={ handleCloseConfirmDelete } style={{ fontSize: '0.8rem', padding: '4px 8px', backgroundColor: 'inherit', borderRadius: 16, color: 'rgba(255, 255, 255, 0.75)', border: '1px solid rgba(255, 255, 255, 0.35)', cursor: 'pointer' }}>Cancelar</button>
						</div>
						{/* <MenuItem onClick={handleClose}>Eliminar</MenuItem>
						<MenuItem onClick={handleClose}>Cancelar</MenuItem> */}
					</Menu>
				</div>
			</div>

			<div
				style={{
					textAlign: 'left',
					letterSpacing: 0.7,
					lineHeight: 1.5,
				}}
			>
				{ project.description }
			</div>

			<div
				style={{
					display: 'flex',
					gap: 24,
					margin: '0 4px',
					color: 'rgba(255, 255, 255, 0.75)',
					fontSize: '0.9rem',
					marginTop: 8,
				}}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						gap: 4,
					}}
				>
					<span>Tareas:</span>
					<span>{ project.taskCount }</span>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						gap: 4,
					}}
				>
					<span>Creado:</span>
					<span>{ project.createdAt }</span>
				</div>
				{
					project.completedAt &&
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 4,
						}}
					>
						<span>Finalizado:</span>
						<span>{ project.completedAt }</span>
					</div>
				}
			</div>

			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					gap: 16,
				}}
			>
				<LinearProgress
					variant='determinate'
					value={ project.progress }
					sx={{
						flex: 1,
						borderRadius: 8,
						height: 8,
					}} />
				<span>{ project.progress }%</span>
			</div>

			<div
				style={{
					textAlign: 'left',
					color: 'rgba(255, 255, 255, 0.8)',
				}}
			>
				<span>Asignado a: { project.assignedUser }</span>
			</div>

			<div
				style={{
					display: 'flex',
					justifyContent: 'flex-start',
				}}
			>
				<Button variant='text' size='small' color='secondary' endIcon={<KeyboardArrowDown />} onClick={ handleToggleShowTasks } >Ver tareas </Button>
			</div>

			<Collapse in={ showTasks } >
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 8,
						marginTop: 4,
					}}
				>
					{
						project.tasks.length === 0
						? <span>No hay tareas asignadas</span>
						: project.tasks.map( ( task, index ) => (
							<div
								key={ task.id }
								style={{
									backgroundColor: 'rgba(255, 255, 255, 0.05)',
									textAlign: 'left',
									padding: '8px 12px',
									borderRadius: 4,
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<span style={{ display: 'flex', flexDirection: 'column', }}>
									<span style={{ textDecoration: Boolean(task.completedAt) ? 'line-through' : 'none' }}>
										{ task.name }
									</span>
									{
										task.completedAt &&
										<span style={{ fontSize: '0.6rem' }}>Completado el: { new Date(task.completedAt).toLocaleDateString() } </span>
									}
								</span>
								<span><Checkbox disabled={ Boolean( task.completedAt ) } checked={ Boolean( task.completedAt ) } onChange={ () => {
									handleCompleteTask( task.id );
								} } /></span>
							</div>
						) )
					}
				</div>
			</Collapse>

		</div>
	)
}


interface SquareButtonProps {
	icon: React.ReactNode;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const SquareButton = ({ icon, onClick }: SquareButtonProps) => {
	return (
		<ButtonBase
			onClick={ onClick }
			sx={{
				display: 'flex',
				border: '1px solid rgba(255, 255, 255, 0.3)',
				borderRadius: '4px',
				padding: '6px 10px',
				cursor: 'pointer',
			}}
		>
			{ icon }
		</ButtonBase>
	)
};