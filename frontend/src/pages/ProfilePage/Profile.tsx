import { Box, Fab, FormControl, IconButton, Input, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import { dto } from '../../../wailsjs/go/models';
import { useUserStore } from '../../store'
import ProfileStyles from './styles/Profile.module.css';
import { AddPhotoAlternate, AlternateEmail, Badge, EmailRounded, Emergency, Key, Password, Visibility, VisibilityOff } from '@mui/icons-material';
import { GetImage } from './functions/files';
import UserEndpoints from '../../api/UserEndpoints';
import AssetImage from '../../components/AssetImage/AssetImage';
import { useState } from 'react';

export const Profile = () => {
	const { user, setUser } = useUserStore();

	const [showPassword, setShowPassword] = useState(false);
	const [showPassword2, setShowPassword2] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  
	const handleClickShowPassword2 = () => setShowPassword2((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
	
	return (
		<div className='emergable'>	
			<MainContent user={user!} onUpdate={setUser}/>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', maxWidth: 750, margin: '40px auto', }}>
				<div style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 32,
				}}>
					<Box sx={{display: 'flex', alignItems: 'center', gap: '8px'}}>
						{/* <Badge />
						<TextField
							label='Nombre de usuario'
							variant='standard' 
							type='text'
							sx={{width: 300}}
							value={user?.name ?? ''}
							/> */}
						<TextField
							fullWidth
							label="Nombre de usuario"
							value={user?.name ?? ''}
							sx={{width: 300}}
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
							/>
					</Box>
					<Box sx={{display: 'flex', alignItems: 'center', gap: '8px'}}>
						<TextField
							fullWidth
							label="Correo electrónico"
							value={user?.email ?? ''}
							sx={{width: 300}}
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
						/>
					</Box>
				</div> 
				<div style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 32,
				}}>
					<Box sx={{display: 'flex', alignItems: 'center', gap: '8px'}}>
						<FormControl sx={{width: 300}} variant="standard">
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
							/>
						</FormControl>
					</Box>
					<Box sx={{display: 'flex', alignItems: 'center', gap: '8px'}}>
						<FormControl sx={{width: 300}} variant="standard">
							<InputLabel htmlFor="outlined-adornment-password">Nueva contraseña</InputLabel>
							<Input
								id="outlined-adornment-password"
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
							/>
						</FormControl>
					</Box>
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
