import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Checkbox, FilledInput, FormControl, FormControlLabel, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { TypeForm } from '../../types/Login';
import styles from './Register.module.css';
import UserEndpoints from '../../api/UserEndpoints';

interface RegisterProps {
  handleChangeTypeForm: (type: TypeForm) => void;
}

export const Register = ({ handleChangeTypeForm }: RegisterProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };




  const userEndpoints = new UserEndpoints();

  useEffect( () => {
    // if( 1 === 2) {
    // }


    // userEndpoints.CreateUser({
    //   email: 'prueba@prueba.com',
    //   password: '123456',
    //   name: 'Jhon Smith'
    // })
  }, [] )


  return (
    <div className={ styles.formContainer }>
      <form className={ styles.form }>
        <Typography variant='h4' fontWeight='lighter' className={ styles.title }>Registro</Typography>
        <div className={ styles.textfields }>
          <TextField variant='filled' fullWidth size='small' type='text' label='Nombre completo' placeholder='Jhon Smith' />
          <TextField variant='filled' fullWidth size='small' type='text' label='Correo electrónico' placeholder='ejemplo@correo.com' />
          <FormControl variant="filled" fullWidth>
            <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
            <FilledInput
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              size='small'
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
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
          <TextField variant='filled' fullWidth size='small' type='password' label='Repetir contraseña' />
          {/* TODO: Poner indicador de si la contraseña es valida usando Progress */}

        </div>

        <div className={ styles.secondaryActions }>
          <FormControl className={ styles.formControl }>
            <FormControlLabel control={<Checkbox />} label='Recordar sesión' />
          </FormControl>
          <Typography><Link to='' className={ styles.forgotPassword }>Olvidé mi contraseña</Link></Typography>
        </div>

        <div className={ styles.actionButtons }>
          <Button variant='contained'>Iniciar sesión</Button>
          <Typography>¿Ya tienes cuenta? <span className={ styles.redirectToRegister } onClick={ () => handleChangeTypeForm( 'LOGIN' ) }>Inicia sesión</span></Typography>
        </div>

      </form>
    </div>
  )
};