import { Box, Button, Fab, FormControl, IconButton, Input, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import { dto } from '../../../wailsjs/go/models';
import { useUserStore } from '../../store'
import ProfileStyles from './styles/Profile.module.css';
import { AddPhotoAlternate, AlternateEmail, Badge, EmailRounded, Emergency, Key, Password, Visibility, VisibilityOff } from '@mui/icons-material';
import { GetImage } from './functions/files';
import UserEndpoints, { ChangeEmailResult, ChangePasswordResult } from '../../api/UserEndpoints';
import AssetImage from '../../components/AssetImage/AssetImage';
import { useEffect, useState } from 'react';
import useForm from '../../hooks/useForm';
import { useAlert } from '../../hooks/useAlert';

export const Profile = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [showPassword2, setShowPassword2] = useState(false);
	const [originalProfile, setOriginalProfile] = useState( {} as dto.UserDtoOut );
	const [profileHasChanges, setProfileHasChanges] = useState( false );
	const [passwordHasChanges, setPasswordHasChanges] = useState( false );
	
	
	
	
	const { openAlert } = useAlert();
	const userEndpoints = new UserEndpoints();
	const { user, setUser } = useUserStore();
	const { dataForm: profileDataForm, setDataForm: profileSetDataForm, onChangeInput: profileOnChangeInput } = useForm({
		name: '',
		email: '',
	});

	const { dataForm: passwordDataForm, setDataForm: passwordSetDataForm, onChangeInput: passwordOnChangeInput } = useForm({
		oldPassword: '',
		newPassword: '',
		newPassword2: ''
	});





  const handleClickShowPassword = () => setShowPassword((show) => !show);
  
	const handleClickShowPassword2 = () => setShowPassword2((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

	const handleUpdateProfile = async () => {
		if( !profileHasChanges ) return;

		if( user === null ) {
			openAlert({  message: 'No se pudo obtener información del perfil. Reincia sesión.', severity: 'error' });
			return;
		}

		// Update profile
		const changeEmailResult = await userEndpoints.ChangeEmail( user.id, profileDataForm.email);
		const changeNameResult = await userEndpoints.UpdateName( user.id, profileDataForm.name);

		const results = await Promise.all([changeEmailResult, changeNameResult]);

		if( ChangeEmailResult[results[0]] === 'USER_NOT_FOUND' ) {
			openAlert({ message: 'Usuario no encontrado', severity: 'error' });
			return;
		}

		if( ChangeEmailResult[results[0]] === 'EMAIL_USED' ) {
			openAlert({ message: 'El correo electrónico ya está en uso', severity: 'error' });
			return;
		}

		if( !results[1] ) {
			openAlert({ message: 'No se pudo actualizar el nombre', severity: 'error' });
			return;
		}

		if( ChangeEmailResult[results[0]] === 'OK' && results[1] ) {
			openAlert({ message: 'Perfil actualizado correctamente', severity: 'success' });
			const userUpdate = await userEndpoints.GetUser(user.id);
			if( userUpdate ) {
				setUser(userUpdate);
			}
		}
	}

	const handleUpdatePassword = () => {
		if( !passwordHasChanges ) return;

		if( user === null ) {
			openAlert({  message: 'No se pudo obtener información del perfil. Reincia sesión.', severity: 'error' });
			return;
		}

		if( passwordDataForm.newPassword.length < 8 ) {
			openAlert({ message: 'La contraseña debe tener al menos 8 caracteres', severity: 'error' });
			return;
		}

		userEndpoints.ChangePassword(user.id, passwordDataForm.oldPassword, passwordDataForm.newPassword)
			.then( result => {
				switch( result ) {
					case ChangePasswordResult['USER_NOT_FOUND']:
						openAlert({ message: 'Usuario no encontrado', severity: 'error' });
						break;
					case ChangePasswordResult['OLD_PASSWORD_INVALID']:
						openAlert({ message: 'Contraseña anterior incorrecta', severity: 'error' });
						break;
					case ChangePasswordResult['SAME_PASSWORD_INVALID']:
						openAlert({ message: 'La nueva contraseña debe ser diferente a la anterior', severity: 'error' });
						break;
					case ChangePasswordResult['OK']:
						openAlert({ message: 'Contraseña actualizada correctamente', severity: 'success' });
						break;
				}

				passwordSetDataForm({
					oldPassword: '',
					newPassword: '',
					newPassword2: ''
				})
			})
	}






	useEffect( () => {
		if( !user ) return;

		profileSetDataForm({
			name: user.name,
			email: user.email,
		});

		setOriginalProfile(user);
	}, [user] )

	useEffect( () => {
		if( !user ) return;

		setProfileHasChanges( profileDataForm.name !== originalProfile.name || profileDataForm.email !== originalProfile.email );
	}, [profileDataForm] );

	useEffect( () => {
		setPasswordHasChanges( passwordDataForm.oldPassword !== '' || passwordDataForm.newPassword !== '' || passwordDataForm.newPassword2 !== '' );
	}, [passwordDataForm] );

	
	return (
		<div className='emergable'>	
			<MainContent user={user!} onUpdate={setUser}/>
			<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 750, margin: '40px auto',}}>
				<div style={{ textAlign: 'left', fontWeight: 600, fontSize: '1.3rem' }}>Actualizar perfil</div>
				<br />
				<div style={{
					display: 'flex',
					flexFlow: 'row wrap',
					gap: 60,
					justifyContent: 'space-between',
				}}>
					<Box sx={{display: 'flex', alignItems: 'center', gap: '8px', flex: 1,}}>
						<TextField
							fullWidth
							label="Nombre de usuario"
							// sx={{width: 300}}
							slotProps={{
								input: {
									startAdornment: (
										<InputAdornment position="start">
											<Badge />
										</InputAdornment>
									),
								},
							}}
							variant="standard"
							name='name'
							value={ profileDataForm.name }
							onChange={ profileOnChangeInput }
						/>
					</Box>
					<Box sx={{display: 'flex', alignItems: 'center', gap: '8px', flex: 1,}}>
						<TextField
							fullWidth
							label="Correo electrónico"
							// sx={{width: 300}}
							slotProps={{
								input: {
									startAdornment: (
										<InputAdornment position="start">
											<AlternateEmail />
										</InputAdornment>
									),
								},
							}}
							variant="standard"
							name='email'
							value={ profileDataForm.email }
							onChange={ profileOnChangeInput }
						/>
					</Box>
				</div> 
				<div style={{ marginTop: 24, display: 'flex', justifyContent: 'left' }}>
					<Button size='small' variant='contained' onClick={ handleUpdateProfile } disabled={ !profileHasChanges }>Actualizar perfil</Button>
				</div>

				<br /><br /><br /><br />

				<div style={{ textAlign: 'left', fontWeight: 600, fontSize: '1.3rem' }}>Actualizar contraseña</div>
				<div style={{
					display: 'flex',
					flexFlow: 'row wrap',
					gap: 60,
					justifyContent: 'space-between',
				}}>
					<Box sx={{display: 'flex', alignItems: 'center', gap: '8px', flex: 1,}}>
						<FormControl variant="standard" sx={{ width: '100%' }}>
							<InputLabel htmlFor="outlined-adornment-password">Contraseña anterior</InputLabel>
							<Input
								id="outlined-adornment-password"
								type={showPassword ? 'text' : 'password'}
								startAdornment={
									<InputAdornment position="start">
										<Key />
									</InputAdornment>
								}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label={
												showPassword ? 'hide the password' : 'display the password'
											}
											onClick={handleClickShowPassword}
											onMouseDown={handleMouseDownPassword}
											onMouseUp={handleMouseUpPassword}
											edge="end"
										>
											{showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								}
								name='oldPassword'
								value={ passwordDataForm.oldPassword }
								onChange={ passwordOnChangeInput }
							/>
						</FormControl>
					</Box>
					<Box sx={{display: 'flex', alignItems: 'center', gap: '8px', flex: 1,}}>
						<FormControl variant="standard" sx={{ width: '100%' }}>
							<InputLabel htmlFor="outlined-adornment-password2">Nueva contraseña</InputLabel>
							<Input
								id="outlined-adornment-password2"
								type={showPassword2 ? 'text' : 'password'}
								startAdornment={
									<InputAdornment position="start">
										<Key />
									</InputAdornment>
								}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label={
												showPassword2 ? 'hide the password' : 'display the password'
											}
											onClick={handleClickShowPassword2}
											onMouseDown={handleMouseDownPassword}
											onMouseUp={handleMouseUpPassword}
											edge="end"
										>
											{showPassword2 ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								}
								name='newPassword'
								value={ passwordDataForm.newPassword }
								onChange={ passwordOnChangeInput }
							/>
						</FormControl>
					</Box>
				</div>
				<div style={{ marginTop: 24, display: 'flex', justifyContent: 'left' }}>
					<Button size='small' variant='contained' onClick={ handleUpdatePassword } disabled={ !passwordHasChanges }>Actualizar contraseña</Button>
				</div>
			</div>
		</div>
	)
}

function MainContent(props: MainContentProperties) {

	const UserController = new UserEndpoints();

	async function onEditImage() {
		const image = await GetImage();

		if (image) {
			const result = await UserController.UpdateUserImage(props.user.id, image);
			if (result) {
				alert('La imagen se subió correctamente');
				const userUpdate = await UserController.GetUser(props.user.id);
				if (userUpdate) {
					props.onUpdate(userUpdate);
				}
				
			} else {
				alert('La imagen no se pudo subir');
			}
		}
	}

	return <div className={ProfileStyles.container}>
		<div className={ProfileStyles.avatarContainer}>
			<div className={ProfileStyles.avatar}>
				<AssetImage bytes={props.user.profilePic?.toString()}/>
			</div>
			<Fab variant='circular' 
				size='small' 
				className={ProfileStyles.EditButton}
				onClick={onEditImage}
			>
				<AddPhotoAlternate sx={{ color: 'rgba(0, 0, 0, 0.8)' }} />
			</Fab>
		</div>
		<Typography variant='h4'>
			Hola, {props.user.name}	
		</Typography>
	</div>
}

interface MainContentProperties {
	user: dto.UserDtoOut,
	onUpdate: (user: dto.UserDtoOut) => void
}
