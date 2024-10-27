import { useState } from 'react';
import { Button, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material'
import { Add, Visibility, VisibilityOff } from '@mui/icons-material';
import { Modal, UsersTable } from '../../components';

export const Users = () => {
	const [showCreateUserModal, setShowCreateUserModal] = useState( false );
	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

	const toggleCreateUserModal = () => setShowCreateUserModal( !showCreateUserModal );

	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 32, alignItems: 'center', }}>
				<h1 className='title'>Usuarios</h1>
				<Button variant='contained' size='small' onClick={ toggleCreateUserModal } startIcon={<Add />}>Crear</Button>
			</div>

			<br />

			<UsersTable />

			<Modal open={ showCreateUserModal } handleClose={ toggleCreateUserModal } title='Crear usuario'>
				{/* <h1>Modal</h1> */}
				<form style={{ 
					display: 'flex', 
					flexDirection: 'column', 
					gap: 16, 
					padding: 16,
					width: 500,
				}}>
					<div style={{ display: 'flex', flexDirection: 'row', gap: 8, }}>
						<TextField size='small' label='Nombre' variant='outlined' fullWidth autoFocus />
						<FormControl fullWidth>
							<InputLabel size='small'>Tipo de usuario</InputLabel>
							<Select size='small' label='Tipo de usuario' variant='outlined' fullWidth>
								<MenuItem>Administrador</MenuItem>
								<MenuItem>Usuario</MenuItem>
							</Select>
						</FormControl>
					</div>

					<TextField size='small' label='Correo electrónico' variant='outlined' fullWidth />

					<FormControl variant='outlined' size='small'>
          <InputLabel htmlFor='outlined-adornment-password'>Contraseña</InputLabel>
          <OutlinedInput
            id='outlined-adornment-password'
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge='end'
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label='Password'
          />
        </FormControl>
					<TextField size='small' label='Confirmar contraseña' variant='outlined' fullWidth type='password' />

					<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
						<Button size='small' variant='contained' sx={{ width: '80px' }} >Crear</Button>
					</div>
				</form>
			</Modal>
		</>
	)
}
