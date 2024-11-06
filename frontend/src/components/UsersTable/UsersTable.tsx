import { ChangeEvent, useEffect, useState } from 'react';
import { Avatar, Box, FormControl, IconButton, InputLabel, Menu, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip } from '@mui/material';
import { Cancel, DeleteOutlined, EditOutlined, Launch, Person, Save } from '@mui/icons-material';
import * as colors from '@mui/material/colors';
import UserEndpoints from '../../api/UserEndpoints';


// TODO: Remover esta importación
import imageSrc from './../../assets/images/profile_photo_example.jpg';
import { useNavigate } from 'react-router-dom';
import { dto } from '../../../wailsjs/go/models';
import { useAlert } from '../../hooks/useAlert';
import { useUserStore } from '../../store';
import AssetImage from '../AssetImage/AssetImage';





const UserProfilePhoto = ({ bytes }: { bytes?: string }) => {
  // Función para obtener un color aleatorio
  const getRandomColor = () => {
    const colorKeys = Object.keys(colors);
    const randomIndex = Math.floor(Math.random() * colorKeys.length);
    return (colors as any)[colorKeys[randomIndex]][200];
  };


  return (
    bytes ? (
      <Box sx={{
        '& img': {
          width: 48,
          height: 48,
          borderRadius: '50%',
          objectFit: 'cover',
        }
      }}>
        <AssetImage bytes={ bytes } key={ bytes } />
      </Box>
    ) : (
      <Avatar sx={{ width: 48, height: 48, bgcolor: getRandomColor() }}>
        <Person sx={{ fontSize: '1.7rem', color: 'rgba(0, 0, 0, 0.8)', }} />
      </Avatar>
    )
  )
};


interface UserActionsProps {
  onVisitUser: () => void;
  onEditRow: () => void;
  onDeleteRow: () => void;
}

interface SaveDiscardChangesProps {
  onSaveRowChanges: () => void;
  onCancelRowChanges: () => void;
}

const UserActions = ({ onVisitUser, onEditRow, onDeleteRow }: UserActionsProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  
  const userEndpoints = new UserEndpoints();



  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <span style={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'flex-end' }}>
      {/* <Tooltip title='Ver usuario'><IconButton onClick={ onVisitUser }><Launch fontSize='small' /></IconButton></Tooltip> */}
      <Tooltip title='Editar registro'><IconButton onClick={ onEditRow } ><EditOutlined fontSize='small' sx={{ color: '#ffcc7a' }} /></IconButton></Tooltip>
      <Tooltip title='Eliminar registro'><IconButton onClick={ handleClick }><DeleteOutlined fontSize='small'  sx={{ color: '#ff6e6e' }} /></IconButton></Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
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
          <button onClick={ onDeleteRow } style={{ fontSize: '0.8rem', padding: '4px 8px', backgroundColor: 'inherit', borderRadius: 16, color: '#ff6e6e', border: '1px solid #ff6e6e', cursor: 'pointer' }}>Eliminar</button>
          <button onClick={ handleClose } style={{ fontSize: '0.8rem', padding: '4px 8px', backgroundColor: 'inherit', borderRadius: 16, color: 'rgba(255, 255, 255, 0.75)', border: '1px solid rgba(255, 255, 255, 0.35)', cursor: 'pointer' }}>Cancelar</button>
        </div>
        {/* <MenuItem onClick={handleClose}>Eliminar</MenuItem>
        <MenuItem onClick={handleClose}>Cancelar</MenuItem> */}
      </Menu>
    </span>
  )
};

const SaveDiscardChanges = ({ onSaveRowChanges, onCancelRowChanges }: SaveDiscardChangesProps) => {
  return (
    <span style={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'flex-end' }}>
      <Tooltip title='Guardar cambios'><IconButton onClick={ onSaveRowChanges } ><Save sx={{ color: '#c3daff' }} /></IconButton></Tooltip>
      <Tooltip title='Descartar cambios'><IconButton onClick={ onCancelRowChanges } ><Cancel sx={{ color: '#ff6e6e' }} /></IconButton></Tooltip>
    </span>
  )
};



const convertImageToUint8Array = async (): Promise<Uint8Array> => {
  const response = await fetch(imageSrc);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  return new Uint8Array(arrayBuffer);
};
















interface CreateRowParams {
  id: number,
  imgSrc?: string;
  user: string;
  email: string;
  role: string;
  date: Date;
}

export interface RowUsersTable {
  id: number;
  profilePic: {
    label: JSX.Element;
    editable: boolean;
  };
  user: {
    label: string;
    editable: boolean;
  };
  email: {
    label: string;
    editable: boolean;
  };
  role: {
    label: string;
    editable: boolean;
  };
  created_at: {
    label: string;
    editable: boolean;
  };
}

const createRow = ({ id, imgSrc, user, email, role, date }: CreateRowParams ) => {
  return {
    id: id,
    profilePic: {
      label: <UserProfilePhoto bytes={ imgSrc } />,
      editable: false,
    },
    user: {
      label: user,
      editable: true,
    },
    email: {
      label: email,
      editable: true,
    },
    role: {
      label: role,
      editable: true,
    },
    created_at: {
      label: date.toLocaleDateString(),
      editable: false,
    },
  }
}


const columns2 = [
  {
    id: 'user',
    label: 'Usuario',
    minWidth: 170,
    align: 'left',
    protected: false
  },
  {
    id: 'email',
    label: 'Correo',
    minWidth: 170,
    align: 'right',
    protected: false
  },
  {
    id: 'role',
    label: 'Rol',
    minWidth: 170,
    align: 'right',
    protected: false
  },
  {
    id: 'created_at',
    label: 'Fecha creación',
    minWidth: 170,
    align: 'right',
    protected: false
  },
  {
    id: 'actions',
    label: 'Acciones',
    minWidth: 170,
    align: 'right',
    protected: true
  },
]


interface UsersTableProps {
  users: dto.UserDtoOut[];
  handleEditUser: ( user: RowUsersTable ) => void;
  handleDeleteUser: ( userId: number ) => void;
}

const roleMap = {
  'ADMIN': 'Administrador',
  'ARTIST': 'Artista',
}

export const UsersTable = ({ users, handleEditUser, handleDeleteUser }: UsersTableProps) => {
	const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editRow, setEditRow] = useState<RowUsersTable | null>( null );
  const [rows, setRows] = useState<RowUsersTable[]>([]);



  const navigate = useNavigate();
  const { openAlert } = useAlert();
  const { user } = useUserStore();



  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onEditRowClick = ( rowId: number ) => {
    const user = users.find(user => user.id === rowId);
    if (user) {
      const row = createRow({ id: user.id, imgSrc: user.profilePic ? user.profilePic.toString() : undefined, user: user.name, email: user.email, role: user.role, date: new Date(user.createdAt) });
      setEditRow(row);
    } else {
      setEditRow(null);
    }
  };

  // Actualiza el estado de editRow, con los nuevos valores
  const onRowChange = ( e: ChangeEvent<HTMLInputElement> ) => {
    const { value, name } = e.target;

    if( editRow ) {
      const updatedRow = { ...editRow, [name]: { label: value, editable: true } };
      setEditRow( updatedRow );
    }
  }

	const validateEmail = (email: string): boolean => {
		const re = /\S+@\S+\.\S+/;
		return re.test(email);
	}

  const onSaveRowChanges = () => {
    const isValidEmail = validateEmail( editRow?.email.label ?? '' );

		if( !isValidEmail ) {
			openAlert({ message: 'Correo electrónico inválido.', severity: 'error' });
			return;
		}

    if( editRow ) {
      handleEditUser(editRow);
      setEditRow( null );
    }
  }

  const onCancelRowChanges = () => {
    setEditRow( null );
  }

  const onDeleteRow = ( row: RowUsersTable ) => {
    if ( user?.id !== undefined && user?.id === row.id ) {
      openAlert({ message: 'No puedes eliminar tu propio usuario.', severity: 'error' });
      return;
    }
    
    handleDeleteUser( row.id );
  }

  const onVisitUser = ( rowId: number ) => {
    navigate('/user/' + rowId);
  }

  useEffect( () => {
    const allRows = users.map( user => createRow({ id: user.id, imgSrc: user.profilePic ? user.profilePic.toString() : undefined, user: user.name, email: user.email, role: roleMap[user.role as keyof typeof roleMap] ?? '--', date: new Date( user.createdAt ) }) );

    setRows( allRows );
  }, [users] );

	return (
		<Paper sx={{ width: '100%', overflow: 'hidden', backgroundColor: 'rgba(255, 255, 255, 0.1)', '& .MuiTableCell-root': {borderBottom: '1px solid rgba(255, 255, 255, 0.6)'} }}>
      <TableContainer>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns2.map((column, index) => (
                (column.protected === false || (column.protected === true && user?.role === 'ADMIN')) &&
                  <TableCell
                    key={column.id}
                    align={index === 0 ? 'left' : 'right'}
                    sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  >
                    {column.label}
                  </TableCell>


              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, idx) => {
                return (
                  <TableRow hover role='checkbox' tabIndex={-1} key={row.email.label+idx}>
                    <TableCell align='left' sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 1,
                    }}>
                      { row.profilePic.label }
                      { row.id === editRow?.id
                        ? <TextField size='small' name='user' value={ editRow.user.label } onChange={ onRowChange } />
                        : row.user.label
                      }  
                    </TableCell>
                    <TableCell align='right'>
                      { row.id === editRow?.id
                        ? <TextField size='small' name='email' value={ editRow.email.label } onChange={ onRowChange } />
                        : row.email.label
                      }
                    </TableCell>
                    <TableCell align='right'>
                      { row.id === editRow?.id
                        ? <FormControl fullWidth size='small'>
                            <InputLabel id="role-select-label">Rol</InputLabel>
                            <Select
                              size='small'
                              labelId="role-select-label"
                              sx={{ textAlign: 'left' }}
                              value={ editRow.role.label }
                              label="Rol"
                              onChange={ (e) => {
                                setEditRow({ ...editRow, role: { label: e.target.value as string, editable: true } });
                              } }
                            >
                              {
                                Object.entries(roleMap).map( ([key, value]) => (
                                  <MenuItem key={key} value={key}>{value}</MenuItem>
                                ))
                              }
                            </Select>
                          </FormControl>
                        : row.role.label
                      }
                    </TableCell>
                    <TableCell align='right'>
                      { row.created_at.label }
                    </TableCell>
                    {
                      user?.role === 'ADMIN' &&
                      <TableCell align='right'>
                        { row.id === editRow?.id
                          ? <SaveDiscardChanges onSaveRowChanges={ onSaveRowChanges } onCancelRowChanges={ onCancelRowChanges } />
                          : <UserActions onVisitUser={ () => onVisitUser( row.id ) } onEditRow={ () => onEditRowClick( row.id ) } onDeleteRow={ () => onDeleteRow( row ) } />
                        }
                      </TableCell>
                    }
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
	)
}