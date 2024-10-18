import { NavLink, useNavigate } from 'react-router-dom';
import { Container, CustomScroll } from '../..';
import styles from './PrivateLayout.module.css';
import { ButtonBase, Divider, Icon, IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { AccountCircle, Home, Info, Logout, MoreVert, Person, RocketLaunch, Settings, StickyNote2 } from '@mui/icons-material';
import { useAuthStore, useUserStore } from '../../../store';
import { useState } from 'react';
import AssetImage from '../../AssetImage/AssetImage';

interface PrivateLayoutProps {
	children: React.ReactNode | React.ReactNode[];
}

export const PrivateLayout = ({ children }: PrivateLayoutProps) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	
	const { user } = useUserStore();

	const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

	return (
		<div className={ styles.layout }>
			
			<main className={ styles.main + ' emergable'}>
				<Container style={{ height: 'calc(100% - 32px)', width: '100%', padding: '16px 0', overflow: 'hidden', }}>
					<CustomScroll>
						{ children }
					</CustomScroll>
				</Container>

			</main>

			{/* Menú lateral */}
			<aside className={ styles.aside + ' emergable'}>
				<Container style={{ padding: '8px 0', height: 'calc(100% - 16px)' }} className={ styles.aside_content }>
					<div className={ styles.menu_options_container }>
							<ButtonBase className={ styles.menu_option }>
								<NavLink to='/home'>
									<Icon><Home /></Icon>
									<span>Inicio</span>
								</NavLink>
							</ButtonBase>
							<ButtonBase className={ styles.menu_option }>
								<NavLink to='/projects'>
									<Icon><RocketLaunch /></Icon>
									<span>Proyectos</span>
								</NavLink>
							</ButtonBase>
							<ButtonBase className={ styles.menu_option }>
								<NavLink to='/users'>
									<Icon><Person /></Icon>
									<span>Usuarios</span>
								</NavLink>
							</ButtonBase>
					</div>
					<div className={ styles.profile_and_settings }>
						<hr />
						<div className={ styles.profile_container }>
							<NavLink to='/profile' className={ styles.user_profile }>
								<AssetImage bytes={user?.profilePic?.toString()}/>
								{/* <Icon sx={{ fontSize: '2rem', }}>
								{ user?.profilePic || <AccountCircle style={{ fontSize: 'inherit' }} /> }
								</Icon> */}
								<span className={ styles.user_name }>{ user?.name || '-' }</span>
							</NavLink>
							<IconButton onClick={ handleMoreClick }><MoreVert /></IconButton>
							<ProfileMenu anchorEl={ anchorEl } setAnchorEl={ setAnchorEl } />
						</div>
					</div>
				</Container>
			</aside>
		</div>
	)
}

const ProfileMenu = ({  anchorEl, setAnchorEl }: {anchorEl: any, setAnchorEl: any}) => {
	const { logout } = useAuthStore();
	const navigate = useNavigate();
	
	const open = Boolean(anchorEl);

	const handleClose = () => {
		setAnchorEl(null);
	}
  
  const handleLogout = () => {
    setAnchorEl(null);
		logout();
		navigate('/');
  };

	return (
		<Menu
			anchorEl={anchorEl}
			id="account-menu"
			open={open}
			onClose={handleClose}
			onClick={handleClose}
			slotProps={{
				paper: {
					elevation: 0,
					sx: {
						border: '1px solid rgba(255, 255, 255, 0.15)',
					},
				},
			}}
			transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
			anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
		>
			<MenuItem onClick={() => {
				handleClose();
				navigate('/settings');
			}}>
				<ListItemIcon>
					<Settings fontSize="small" />
				</ListItemIcon>
				Ajustes
			</MenuItem>
			<MenuItem onClick={handleClose}>
				<ListItemIcon>
					<Info fontSize="small" />
				</ListItemIcon>
				Información
			</MenuItem>
			<Divider />
			<MenuItem onClick={handleLogout}>
				<ListItemIcon>
					<Logout fontSize="small" />
				</ListItemIcon>
				Salir
			</MenuItem>
		</Menu>
	)
}