import { Button, ButtonBase, Collapse, LinearProgress } from "@mui/material";
import { Project } from "../../interfaces";
import { DeleteOutlined, EditNoteOutlined, KeyboardArrowDown, VisibilityOutlined } from "@mui/icons-material";
import React, { useState } from "react";

interface ProjectCardProps {
	project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
	const [showTasks, setShowTasks] = useState( false );

	console.log({ project })

	const handleToggleShowTasks = () => {
		setShowTasks( !showTasks );
	}

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
					<SquareButton icon={<VisibilityOutlined style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.8)' }} />} onClick={ () => console.log( 'Ver detalles' ) } />
					<SquareButton icon={<EditNoteOutlined style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.8)' }} />} onClick={ () => console.log( 'Ver detalles' ) } />
					<SquareButton icon={<DeleteOutlined style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.8)' }} />} onClick={ () => console.log( 'Ver detalles' ) } />
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
						project.tasks.map( ( task, index ) => (
							<div
								key={ index }
								style={{
									backgroundColor: 'rgba(255, 255, 255, 0.05)',
									textAlign: 'left',
									padding: '8px 12px',
									borderRadius: 4,
								}}
							>
								<span>{ task }</span>
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
	onClick: () => void;
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