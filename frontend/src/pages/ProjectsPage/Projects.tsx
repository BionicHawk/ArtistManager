import { Add, KeyboardArrowDown, Settings, } from "@mui/icons-material"
import { Box, Button, Collapse, IconButton, LinearProgress, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material"
import { Project } from "../../interfaces"
import { Modal, ProjectCard } from "../../components"
import React, { useState } from "react"

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

const steps = ['Crear proyecto', 'Asignar tareas'];

export const Projects = () => {
  const [showCreateProjectModal, setShowCreateProjectModal] = useState( false );
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());









  const toggleCreateProjectModal = () => setShowCreateProjectModal( !showCreateProjectModal );

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 32, alignItems: 'center', }}>
				<h1 className='title'>Proyectos</h1>
				<Button onClick={ toggleCreateProjectModal } variant='contained' size='small' startIcon={<Add />}>Crear</Button>
			</div>

			<br />

			<div style={{ display: 'flex', gap: 16, flexDirection: 'column', }}>
				{ projects.map( project => (
					<ProjectCard key={ project.id } project={ project } />
				) ) }
			</div>

      <Modal open={ showCreateProjectModal } handleClose={ toggleCreateProjectModal } title='Crear proyecto' >
        <Stepper activeStep={activeStep} sx={{ width: '500px' }}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption">Opcional</Typography>
              );
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              El proyecto fue creado con éxito.
            </Typography>
          </React.Fragment>
        ) : (
          <React.Fragment>

            {/* Primer paso crear proyecto */}
            { activeStep === 0 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  padding: 16,
                  width: 500,
                  marginTop: 16,
                }}>
                  <TextField size='small' label='Nombre del proyecto' variant='outlined' fullWidth autoFocus />
                  <TextField size='small' label='Descripción' variant='outlined' fullWidth multiline rows={4} />
                </div>
              )
            }

            {/* Segundo paso asignar tareas & usuarios */}
            { activeStep === 1 && (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 16, 
                  padding: 16,
                  width: 500,
                  marginTop: 16,
                 }}>
                  <TextField size='small' label='Nombre de la tarea' variant='outlined' fullWidth autoFocus />
                  <TextField size='small' label='Descripción' variant='outlined' fullWidth multiline rows={4} />
                </div>
              )
            }
  
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Regresar
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              {isStepOptional(activeStep) && (
                <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                  Saltar
                </Button>
              )}
              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Terminar' : 'Siguiente'}
              </Button>
            </Box>
          </React.Fragment>
        )}
			</Modal>
		</>
	)
}
