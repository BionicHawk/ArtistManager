import { ChangeEvent, useState } from 'react';
import { Avatar, IconButton, Menu, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip } from '@mui/material';
import { Cancel, DeleteOutlined, EditOutlined, Launch, Person, Save } from '@mui/icons-material';
import * as colors from '@mui/material/colors';


// TODO: Remover esta importación
import imageSrc from './../../assets/images/profile_photo_example.jpg';
import { useNavigate } from 'react-router-dom';





const UserProfilePhoto = ({ image }: { image?: Uint8Array }) => {
  const imageUrl = image ? URL.createObjectURL(new Blob([image])) : undefined;

  // Función para obtener un color aleatorio
  const getRandomColor = () => {
    const colorKeys = Object.keys(colors);
    const randomIndex = Math.floor(Math.random() * colorKeys.length);
    return (colors as any)[colorKeys[randomIndex]][200];
  };


  return (
    image ? (
      <Avatar
        src={ imageUrl }
        sx={{ width: 48, height: 48 }}
      />
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



  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <span>
      <Tooltip title='Ver usuario'><IconButton onClick={ onVisitUser }><Launch fontSize='small' /></IconButton></Tooltip>
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
    <span>
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
  imgSrc?: Uint8Array;
  user: string;
  email: string;
  role: string;
  date: Date;
}

interface Row {
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
      label: <UserProfilePhoto image={ imgSrc } />,
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
  },
  {
    id: 'email',
    label: 'Correo',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'role',
    label: 'Rol',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'created_at',
    label: 'Fecha creación',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'actions',
    label: 'Acciones',
    minWidth: 170,
    align: 'right',
  },
]

const rowsInitialValues = [
  createRow({ id: 1, imgSrc: undefined, user: 'Juan Pérez', email: 'juan.perez@examle.com', role: 'Admin', date: new Date('2021-10-15') }),
  createRow({ id: 2, imgSrc: undefined, user: 'Ana Gómez', email: 'ana.gomez@example.com', role: 'User', date: new Date('2021-11-20') }),
  createRow({ id: 3, imgSrc: undefined, user: 'Carlos Ruiz', email: 'carlos.ruiz@example.com', role: 'Moderator', date: new Date('2021-12-05') }),
  createRow({ id: 4, imgSrc: undefined, user: 'María López', email: 'maria.lopez@example.com', role: 'Admin', date: new Date('2022-01-10') }),
  createRow({ id: 5, imgSrc: undefined, user: 'Pedro Sánchez', email: 'pedro.sanchez@example.com', role: 'User', date: new Date('2022-02-15') }),
  createRow({ id: 6, imgSrc: undefined, user: 'Lucía Fernández', email: 'lucia.fernandez@example.com', role: 'Moderator', date: new Date('2022-03-20') }),
  createRow({ id: 7, imgSrc: undefined, user: 'Jorge Martínez', email: 'jorge.martinez@example.com', role: 'Admin', date: new Date('2022-04-25') }),
  createRow({ id: 8, imgSrc: undefined, user: 'Laura García', email: 'laura.garcia@example.com', role: 'User', date: new Date('2022-05-30') }),
  createRow({ id: 9, imgSrc: undefined, user: 'Sofía Rodríguez', email: 'sofia.rodriguez@example.com', role: 'Moderator', date: new Date('2022-06-04') }),
  createRow({ id: 10, imgSrc: undefined, user: 'David Hernández', email: 'david.hernandez@example.com', role: 'Admin', date: new Date('2022-07-09') }),
  createRow({ id: 11, imgSrc: undefined, user: 'Marta Jiménez', email: 'marta.jimenez@example.com', role: 'User', date: new Date('2022-08-14') }),
  createRow({ id: 12, imgSrc: undefined, user: 'Raúl Díaz', email: 'raul.diaz@example.com', role: 'Moderator', date: new Date('2022-09-19') }),
  createRow({ id: 13, imgSrc: undefined, user: 'Elena Torres', email: 'elena.torres@example.com', role: 'Admin', date: new Date('2022-10-24') }),
  createRow({ id: 14, imgSrc: undefined, user: 'Pablo Romero', email: 'pablo.romero@example.com', role: 'User', date: new Date('2022-11-29') }),
  createRow({ id: 15, imgSrc: undefined, user: 'Clara Vázquez', email: 'clara.vazquez@example.com', role: 'Moderator', date: new Date('2022-12-04') }),
  createRow({ id: 16, imgSrc: undefined, user: 'Sergio Moreno', email: 'sergio.moreno@example.com', role: 'Admin', date: new Date('2023-01-09') }),
  createRow({ id: 17, imgSrc: undefined, user: 'Paula Ruiz', email: 'paula.ruiz@example.com', role: 'User', date: new Date('2023-02-14') }),
  createRow({ id: 18, imgSrc: undefined, user: 'Luis Gómez', email: 'luis.gomez@example.com', role: 'Moderator', date: new Date('2023-03-21') }),
  createRow({ id: 19, imgSrc: undefined, user: 'Isabel Sánchez', email: 'isabel.sanchez@example.com', role: 'Admin', date: new Date('2023-04-26') }),
  createRow({ id: 20, imgSrc: undefined, user: 'Miguel Fernández', email: 'miguel.fernandez@example.com', role: 'User', date: new Date('2023-05-31') }),
  createRow({ id: 21, imgSrc: undefined, user: 'Natalia Martínez', email: 'natalia.martinez@example.com', role: 'Moderator', date: new Date('2023-06-05') })
]




export const UsersTable = () => {
	const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editRow, setEditRow] = useState<Row | null>( null );
  const [rows, setRows] = useState( rowsInitialValues );



  const navigate = useNavigate();



  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onEditRowClick = ( rowId: number ) => {
    setEditRow( rows.find( row => row.id === rowId ) || null );
  };

  // Actualiza el estado de editRow, con los nuevos valores
  const onRowChange = ( e: ChangeEvent<HTMLInputElement> ) => {
    const { value, name } = e.target;

    console.log({ value, name })

    if( editRow ) {
      const updatedRow = { ...editRow, [name]: { label: value, editable: true } };
      setEditRow( updatedRow );
    }
  }

  const onSaveRowChanges = () => {
    if( editRow ) {
      const updatedRows = rows.map( row => row.id === editRow.id ? editRow : row );
      setRows( updatedRows );
      setEditRow( null );
    }
  }

  const onCancelRowChanges = () => {
    setEditRow( null );
  }

  const onDeleteRow = ( rowId: number ) => {
    const updatedRows = rows.filter( row => row.id !== rowId );
    setRows( updatedRows );
  }

  const onVisitUser = ( rowId: number ) => {
    navigate('/user/' + rowId);
  }

	return (
		<Paper sx={{ width: '100%', overflow: 'hidden', backgroundColor: 'rgba(255, 255, 255, 0.1)', '& .MuiTableCell-root': {borderBottom: '1px solid rgba(255, 255, 255, 0.6)'} }}>
      <TableContainer>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns2.map((column, index) => (
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
                        ? <TextField size='small' name='role' value={ editRow.role.label } onChange={ onRowChange } />
                        : row.role.label
                      }
                    </TableCell>
                    <TableCell align='right'>
                      { row.created_at.label }
                    </TableCell>
                    <TableCell align='right'>
                      { row.id === editRow?.id
                        ? <SaveDiscardChanges onSaveRowChanges={ onSaveRowChanges } onCancelRowChanges={ onCancelRowChanges } />
                        : <UserActions onVisitUser={ () => onVisitUser( row.id ) } onEditRow={ () => onEditRowClick( row.id ) } onDeleteRow={ () => onDeleteRow( row.id ) } />
                      }
                    </TableCell>
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