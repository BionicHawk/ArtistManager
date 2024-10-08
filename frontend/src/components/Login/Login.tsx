import { Button, Checkbox, FilledInput, FormControl, FormControlLabel, FormHelperText, IconButton, InputAdornment, InputLabel, TextField, Typography } from '@mui/material';
import { TypeForm } from '../../types/Login';
import styles from './Login.module.css';
import { Link } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import useForm from '../../hooks/useForm';
import UserEndpoints from '../../api/UserEndpoints';
import { useAuthStore, useUserStore } from '../../store';
import { useAlert } from '../../hooks/useAlert';
import { User } from '../../interfaces';
import { saveRemeberSession } from '../../utils/saveRememberSession';

export const Login = ({ handleChangeTypeForm }: { handleChangeTypeForm: (type: TypeForm) => void; }) => {
  const userEndpoints = new UserEndpoints();

  const [showPassword, setShowPassword] = useState( false );




  const { dataForm, onChangeInput, onFocusInput, setDataForm } = useForm( {
    email: '',
    password: '',
    rememberSession: false,
  } );

  const { openAlert } = useAlert();
  const { setUser } = useUserStore();
  const { login } = useAuthStore();





  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async ( event: React.FormEvent<HTMLFormElement> ) => {
    event.preventDefault();

    const result = await userEndpoints.Login( dataForm.email, dataForm.password );
    
    if ( result === null ) {
      openAlert({ message: 'Error al iniciar sesión.', severity: 'error' });
      return;
    }

    saveRemeberSession( dataForm.rememberSession );

    handleLogin( result );
  };

  const handleLogin = ( userResult: User) => {
    setUser( userResult );
    login();
  };






  return (
    <div className={ styles.formContainer }>
      <form className={ styles.form } onSubmit={ handleSubmit }>
        <Typography variant='h4' fontWeight='lighter' className={ styles.title }>Inicio de sesión</Typography>
        <div className={ styles.textfields }>
        <TextField
            fullWidth
            variant='filled'
            size='small'
            type='email'
            label='Correo electrónico'
            placeholder='ejemplo@correo.com'
            name='email'
            value={ dataForm.email }
            onChange={ onChangeInput }
            onFocus={ onFocusInput }
          />
          <FormControl variant="filled">
              <InputLabel htmlFor="password-login">Contraseña</InputLabel>
              <FilledInput
                id="password-login"
                type={showPassword ? 'text' : 'password'}
                size='small'
                name='password'
                value={ dataForm.password }
                onChange={ onChangeInput }
                onFocus={ onFocusInput }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
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
        </div>

        <div className={ styles.secondaryActions }>
          <FormControl className={ styles.formControl }>
            <FormControlLabel control={<Checkbox onClickCapture={ () => setDataForm({ ...dataForm, rememberSession: !dataForm.rememberSession }) } checked={ dataForm.rememberSession } />} label='Recordar sesión' />
          </FormControl>
          <Typography><Link to='' className={ styles.forgotPassword }>Olvidé mi contraseña</Link></Typography>
        </div>

        <div className={ styles.actionButtons }>
          <Button variant='contained' type='submit'>Iniciar sesión</Button>
          <Typography>¿No tienes cuenta? <span className={ styles.redirectToRegister } onClick={ () => handleChangeTypeForm( 'REGISTER' ) }>Registrate aquí</span></Typography>
        </div>

      </form>
    </div>
  )
};