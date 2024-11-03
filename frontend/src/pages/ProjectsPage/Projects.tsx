import { AccountCircle, Add, Close, KeyboardArrowDown, Settings, } from '@mui/icons-material'
import { Box, Button, Collapse, FormControl, IconButton, Input, InputAdornment, InputLabel, LinearProgress, MenuItem, Select, SelectChangeEvent, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material'
import { Project, User } from '../../interfaces'
import { Modal, ProjectCard } from '../../components'
import React, { useEffect, useState } from 'react'
import ProjectEndpoints from '../../api/ProjectEndpoints';
import useForm from '../../hooks/useForm'
import UserEndpoints from '../../api/UserEndpoints'

// Datos de ejemplo
// const projects: Project[] = [
//   {
//     id: 1,
//     name: 'Proyecto A',
//     description: 'Este es un proyecto de ejemplo con una descripción que no excede los 500 caracteres.',
//     taskCount: 10,
//     progress: 75,
//     createdAt: '2023-01-15',
//     completedAt: null,
//     assignedUser: 'Juan Pérez',
//     tasks: ['Tarea 1', 'Tarea 2', 'Tarea 3']
//   },
//   {
//     id: 2,
//     name: 'Proyecto B',
//     description: 'Otro proyecto de ejemplo con una descripción corta.',
//     taskCount: 5,
//     progress: 100,
//     createdAt: '2023-02-20',
//     completedAt: '2023-05-10',
//     assignedUser: 'María García',
//     tasks: ['Tarea 1', 'Tarea 2']
//   },
//   // Añade más proyectos aquí...
// ]

const steps = ['Crear proyecto', 'Asignar tareas'];

export const Projects = () => {
  const [showCreateProjectModal, setShowCreateProjectModal] = useState( false );
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [projects, setProjects] = useState<Project[] | []>( []);
  const [users, setUsers] = useState<User[] | []>( [] );
  const [userSelected, setUserSelected] = React.useState<number | undefined>( undefined );
  const [createdProjectId, setCreatedProjectId] = useState<number | null>( null );
  const [inputValues, setInputValues] = useState<{ id?: number, activityName: string }[]>([]);
  const [isEdition, setIsEdition] = useState( false );

  const handleUserSelected = (event: SelectChangeEvent) => {
    setUserSelected(Number(event.target.value));
  };





  const { dataForm, setDataForm, onChangeInput, clearForm } = useForm( { 
    projectName: '',
    projectDescription: '',
  } );


  const projectEndpoints = new ProjectEndpoints();
  const userEndpoints = new UserEndpoints();





  const toggleCreateProjectModal = () => {
    clearForm();
    setUserSelected( undefined );
    setActiveStep( 0 );
    setShowCreateProjectModal( !showCreateProjectModal );
    setIsEdition( false );
  };

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    if( isEdition ) {
      handleNextEdition()
      return;
    };

    let newSkipped = skipped;
    
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    
    // Crear proyecto
    if( activeStep === 0 ) {
      if( dataForm.projectName.length < 4 ) { alert("El nombre del proyecto debe tener más de 3 caracteres."); return; }
      if( dataForm.projectDescription.length === 0 ) { alert("Debe agregar una descripción al proyecto."); return; }


      // Lógica para crear el proyecto
      projectEndpoints.CreateProject( userSelected ?? 0 , {
        name: dataForm.projectName ?? 'Sin nombre',
        description: dataForm.projectDescription ?? 'Sin descripción',
      } )
        .then( response => {
          getAllProjects();
          
          if( response.result === 0 ) {
            setCreatedProjectId( response.projectId );
            clearForm();
          }
        } );
    }

    if( activeStep === 1 ) {
      // Lógica para asignar tareas
      inputValues.forEach( async taskName => {
        await projectEndpoints.AddTask( userSelected ?? 0, createdProjectId ?? 0, { activityName: taskName.activityName } );
      } );

      setTimeout(() => {
        getAllProjects();
      }, 1000);
      toggleCreateProjectModal();
      setInputValues( [] );
      setActiveStep( 0 );
    }

    
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleNextEdition = async () => {
    console.log({ createdProjectId, userSelected, dataForm, inputValues });
    if( dataForm.projectName.length < 4 ) { alert("El nombre del proyecto debe tener más de 3 caracteres."); return; }
    if( dataForm.projectDescription.length === 0 ) { alert("Debe agregar una descripción al proyecto."); return; }

    // Lógica para editar el proyecto
    projectEndpoints.UpdateProject( createdProjectId ?? 0, 
      userSelected ?? 0,
      dataForm.projectName ?? 'Sin nombre',
      dataForm.projectDescription ?? 'Sin descripción',
    )
      .then( response => {
        getAllProjects();
        setActiveStep((prevActiveStep) => prevActiveStep + 1);

        projectEndpoints.GetProjectTasks( createdProjectId ?? 0 )
          .then( tasks => {
            setInputValues( tasks.map( task => ({ id: task.id, activityName: task.activityName }) ) );
          } );
          
          // clearForm();
          // toggleCreateProjectModal();
        } );
        
    if( activeStep === 1 ) {
      console.log({ inputValues });
      inputValues.forEach(async task => {
        if( task.activityName.length === 0 ) return;

        await projectEndpoints.UpdateTask( task.id ?? 0, task.activityName );
      });
    }
  }

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  // const handleSkip = () => {
  //   if (!isStepOptional(activeStep)) {
  //     // You probably want to guard against something like this,
  //     // it should never occur unless someone's actively trying to break something.
  //     throw new Error('You can\'t skip a step that isn\'t optional.');
  //   }

  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //   setSkipped((prevSkipped) => {
  //     const newSkipped = new Set(prevSkipped.values());
  //     newSkipped.add(activeStep);
  //     return newSkipped;
  //   });
  // };

  const getUsers = async () => {
    try {
      const response = await userEndpoints.GetAllUsers();
      if (response) {
        setUsers(response);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  const getAllProjects = async () => {
    try {
      const response = await projectEndpoints.GetAllProjects();
      if (response) {
        const projects = await Promise.all(response.map(async (projectEle) => {
          const assignedUser = projectEle.userId === 0 
            ? 'Sin usuario asignado' 
            : await userEndpoints.GetUser(projectEle.userId).then(user => user?.name ?? '');

          const tasks = await projectEndpoints.GetProjectTasks(projectEle.id);
  
          return {
            id: projectEle.id,
            name: projectEle.name,
            description: projectEle.description.String,
            taskCount: projectEle.numberOfTasks,
            progress: projectEle.advancement,
            createdAt: new Date(projectEle.createdAt).toLocaleDateString(),
            completedAt: projectEle.endedAt.Valid ? new Date(projectEle.endedAt.Time).toLocaleDateString() : null,
            assignedUser: assignedUser,
            tasks: tasks.map(task => ({id: task.id, completed: new Date(task.endedAt), name: task.activityName})),
          };
        }));
  
        setProjects(projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }

  const handleEditProject = ( project: Project ) => {
    console.log("Entró a editar2");
    toggleCreateProjectModal();
    setIsEdition( true );
    setActiveStep( 0 );
    setUserSelected( project.assignedUser === 'Sin usuario asignado' ? undefined : users.find( user => user.name === project.assignedUser )?.id );
    setCreatedProjectId( project.id );
    setInputValues( project.tasks.map(task => ({ id: task.id, activityName: task.name, completedAt: task.completedAt })) );
    setDataForm({
      projectName: project.name,
      projectDescription: project.description,
    });
  }

  const handleCompleteTask = async (taskId: number) => {
    await projectEndpoints.CompleteTask( taskId );
    getAllProjects();
  }


  useEffect( () => {
    getAllProjects();
    getUsers();
  }, [] );


	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 32, alignItems: 'center', }}>
				<h1 className='title'>Proyectos</h1>
				<Button onClick={ toggleCreateProjectModal } variant='contained' size='small' startIcon={<Add />}>Crear</Button>
			</div>

			<br />

			<div style={{ display: 'flex', gap: 16, flexDirection: 'column', }}>
				{ projects.map( project => (
					<ProjectCard key={ project.id } project={ project } updateProjects={ getAllProjects } handleEditProject={ () => handleEditProject(project) } />
				) ).reverse() }
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
                <Typography variant='caption'>Opcional</Typography>
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
                  {/* <TextField size='small' name='projectName' value={ dataForm.projectName } onChange={ onChangeInput } label='' variant='outlined' fullWidth autoFocus /> */}
                  <FormControl fullWidth size='small' sx={{ textAlign: 'left' }}>
                    <InputLabel id="demo-simple-select-label">Asignar a empleado</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={ userSelected ? String(userSelected) : '' }
                      label="Asignar a empleado"
                      onChange={ handleUserSelected }
                    >
                      {
                        users.map( user => (
                          <MenuItem key={ user.id } value={ user.id }>{ user.name }</MenuItem>
                        ) )
                      }
                    </Select>
                  </FormControl>
                  <TextField size='small' name='projectName' value={ dataForm.projectName } onChange={ onChangeInput } label='Nombre del proyecto' variant='outlined' fullWidth autoFocus />
                  <TextField size='small' name='projectDescription' value={ dataForm.projectDescription } onChange={ onChangeInput } label='Descripción' variant='outlined' fullWidth multiline rows={4} />
                </div>
              )
            }

            {/* Segundo paso asignar tareas */}
            { activeStep === 1 && (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 16, 
                  padding: 16,
                  width: 500,
                  marginTop: 16,
                 }}>
                  {
                    // inputValues.map((inputValue, index) => <TextField key={index} size='small' value={inputValue} onChange={(e) => {
                    //   const newInputValues = [...inputValues];
                    //   newInputValues[index] = e.target.value;
                    //   setInputValues(newInputValues);
                    // }} label={`Tarea ${index + 1}`} variant='outlined' fullWidth />)
                    inputValues.map((inputValue, index) => (
                      <FormControl variant="standard">
                        <InputLabel htmlFor="input-with-icon-adornment">
                          {`Tarea ${index + 1}`}
                        </InputLabel>
                        <Input
                          id="input-with-icon-adornment"
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton size='small' onClick={ () => {
                                // Limpiar el valor del input
                                setInputValues(inputValues.filter((_, i) => i !== index));

                                if(inputValues.length === 1) return;
                                const newInputValues = [...inputValues];
                                newInputValues.splice(index, 1);
                                setInputValues(newInputValues);
                              } }>
                                <Close />
                              </IconButton>
                            </InputAdornment>
                          }
                          key={index} size='small' value={inputValue.activityName} onChange={(e) => {
                            const newInputValues = [...inputValues];
                            // newInputValues[index] = e.target.value;
                            newInputValues[index] = { id: inputValue.id ,activityName: e.target.value };
                            setInputValues(newInputValues);
                          }}
                        />
                      </FormControl>)
                    )
                  }
                  <Button size='small' onClick={() => setInputValues([...inputValues, {activityName: ''}])} variant='outlined' startIcon={<Add />}>Agregar tarea</Button>
                </div>
              )
            }
  
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              {/* {isStepOptional(activeStep) && (
                <Button color='inherit' onClick={handleSkip} sx={{ mr: 1 }}>
                  Saltar
                </Button>
              )} */}
              <Button variant='contained' onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Terminar' : 'Siguiente'}
              </Button>
            </Box>
          </React.Fragment>
        )}
			</Modal>
		</>
	)
}
