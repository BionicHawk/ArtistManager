import { useEffect, useState } from 'react';
import { Button, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material'
import { Add, Visibility, VisibilityOff } from '@mui/icons-material';
import { Modal, RowUsersTable, UsersTable } from '../../components';
import useForm from '../../hooks/useForm';
import UserEndpoints, { ChangeEmailResult, CreateUserResult } from '../../api/UserEndpoints';
import { dto } from '../../../wailsjs/go/models';
import { useAlert } from '../../hooks/useAlert';
import { useUserStore } from '../../store';

export const Users = () => {
	const [showCreateUserModal, setShowCreateUserModal] = useState( false );
	const [showPassword, setShowPassword] = useState(false);
	const [users, setUsers] = useState<dto.UserDtoOut[]>( [] );


	const userEndpoints = new UserEndpoints();
	const { dataForm, onChangeInput, clearForm } = useForm({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		roleId: '',
	});
	const { openAlert } = useAlert();

	const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

	const toggleCreateUserModal = () => setShowCreateUserModal( !showCreateUserModal );

	const handleConfirmBtnModal = async () => {
		let result: CreateUserResult = CreateUserResult.OK;
		if( dataForm.roleId === '1' ) result = await userEndpoints.CreateAdmin( dataForm );
		if( dataForm.roleId === '2' ) result = await userEndpoints.CreateUser( dataForm );

		if( dataForm.password !== dataForm.confirmPassword ) {
			openAlert({ message: 'Las contraseñas no coinciden.', severity: 'error' })
			return;
		};

		if(  result === CreateUserResult.INVALID_EMAIL ) {
			openAlert({ message: 'Correo electrónico inválido.', severity: 'error' })
			return;
		};

		if(  result === CreateUserResult.INVALID_PASSWORD ) {
			openAlert({ message: 'La contraseña debe tener 8 carácteres, al menos un número, una mayúscula y una minúscula.', severity: 'error' })
			return;
		};

		if(  result === CreateUserResult.USER_FOUND ) {
			openAlert({ message: 'El usuario ya estaba registrado.', severity: 'error' })
			return;
		};
		
		if(  result === CreateUserResult.OK ) {
			openAlert({ message: 'Usuario registrado con éxito', severity: 'success' })
			getUsers();
			toggleCreateUserModal();
			clearForm();
		};
	}

	const getUsers = async () => {
		const usersResponse = await userEndpoints.GetAllUsers();

		console.log({ usersResponse });

		setUsers( usersResponse );
	}

	const handleEditUser = async (user: RowUsersTable) => {
		const changeEmail = await userEndpoints.ChangeEmail( user.id, user.email.label );		
		const changeName = await userEndpoints.UpdateName( user.id, user.user.label );
		const changeRole = await userEndpoints.UpdateRole( user.id, user.role.label );

		const response = await Promise.all([changeEmail, changeName, changeRole]);

		if( ChangeEmailResult[response[0]] !== 'OK' )	openAlert({ message: 'Correo electrónico inválido.', severity: 'error' });

		if( response[1] === false ) openAlert({ message: 'El usuario ya estaba registrado.', severity: 'error' });

		if( response[2] === false ) openAlert({ message: 'Error al actualizar el rol del usuario.', severity: 'error' });

		if( ChangeEmailResult[response[0]] !== 'OK' || response[1] === false || response[2] === false ) return;

		if( response[0] === ChangeEmailResult.OK && response[1] === true && response[2] === true ) openAlert({ message: 'Usuario actualizado con éxito.', severity: 'success' });

		getUsers();
	}

	const handleDeleteUser = async (userId: number) => {
		const result = await userEndpoints.DeleteUser( userId );

		if( result ) openAlert({ message: 'Usuario eliminado con éxito.', severity: 'success' });
		else openAlert({ message: 'Error al eliminar el usuario.', severity: 'error' });

		getUsers();
	}

	useEffect(() => {
			getUsers();
	}, []);

	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 32, alignItems: 'center', }}>
				<h1 className='title'>Usuarios</h1>
				<Button variant='contained' size='small' onClick={ toggleCreateUserModal } startIcon={<Add />}>Crear</Button>
			</div>

			<br />

			<UsersTable users={ users } handleEditUser={ handleEditUser } handleDeleteUser={ handleDeleteUser } />

			<Modal open={ showCreateUserModal } handleClose={ toggleCreateUserModal } title='Crear usuario'>
				<form onSubmit={ (e) => {
					e.preventDefault();
					handleConfirmBtnModal();
				} } style={{ 
					display: 'flex', 
					flexDirection: 'column', 
					gap: 16, 
					padding: 16,
					width: 500,
				}}>
					<div style={{ display: 'flex', flexDirection: 'row', gap: 8, }}>
						<TextField size='small' label='Nombre' variant='outlined' fullWidth autoFocus name='name' value={ dataForm.name } onChange={ onChangeInput } />
						<FormControl fullWidth>
							<InputLabel size='small'>Tipo de usuario</InputLabel>
							<Select size='small' label='Tipo de usuario' variant='outlined' fullWidth name='roleId' value={ dataForm.roleId } onChange={ (event) => {
								onChangeInput( event as { target: EventTarget & (HTMLInputElement | HTMLTextAreaElement); }  );
							} } sx={{ textAlign: 'left' }}>
								<MenuItem value={ '1' } >Administrador</MenuItem>
								<MenuItem value={ '2' }>Usuario</MenuItem>
							</Select>
						</FormControl>
					</div>

					<TextField size='small' label='Correo electrónico' variant='outlined' fullWidth name='email' value={ dataForm.email } onChange={ onChangeInput } />

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
						name='password'
						value={ dataForm.password }
						onChange={ onChangeInput }
          />
        </FormControl>
					<TextField size='small' label='Confirmar contraseña' variant='outlined' fullWidth type='password' name='confirmPassword' value={ dataForm.confirmPassword } onChange={ onChangeInput } />

					<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
						<Button type='submit' size='small' variant='contained' sx={{ width: '80px' }} onClick={ handleConfirmBtnModal } >Crear</Button>
					</div>
				</form>
			</Modal>
		</>
	)
}
