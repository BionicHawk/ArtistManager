import { Button } from '@mui/material'
import { User as GlobalUser } from '../../interfaces';
import { Add } from '@mui/icons-material';
import { UsersTable } from '../../components';

export type User = Omit<GlobalUser, 'id' | 'pwd' | 'convertValues'>

// const users: User[] = [
// 	{
// 			name: 'John Doe',
// 			profilePic: undefined,
// 			email: 'john.doe@example.com',
// 			projects: [],
// 			role: 'Admin',
// 			createdAt: '2023-01-01'
// 	},
// 	{
// 			name: 'Jane Smith',
// 			profilePic: undefined,
// 			email: 'jane.smith@example.com',
// 			projects: [],
// 			role: 'User',
// 			createdAt: '2023-02-01'
// 	}
// ];

export const Users = () => {
	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 32, alignItems: 'center', }}>
				<h1 className='title'>Usuarios</h1>
				<Button variant='contained' size='small' startIcon={<Add />}>Crear</Button>
			</div>

			<br />

			{/* <div style={{ display: 'flex', gap: 16, flexDirection: 'column', }}>
				{ users.map( user => (
					<UserCard key={ user.name } user={ user } />
				) ) }
			</div> */}
			<UsersTable />
		</>
	)
}
