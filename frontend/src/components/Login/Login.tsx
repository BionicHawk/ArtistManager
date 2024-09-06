import { Button, Checkbox, FormControl, FormControlLabel, FormLabel, TextField, Typography } from '@mui/material';
import { TypeForm } from '../../types/Login';
import styles from './Login.module.css';
import { Link } from 'react-router-dom';

export const Login = ({ handleChangeTypeForm }: { handleChangeTypeForm: (type: TypeForm) => void; }) => (
  <div className={ styles.formContainer }>
    <form className={ styles.form }>
      <Typography variant='h4' fontWeight='lighter' className={ styles.title }>Inicio de sesión</Typography>
      <div className={ styles.textfields }>
        <TextField variant='filled' fullWidth size='small' type='text' label='Correo electrónico' placeholder='ejemplo@correo.com' />
        <TextField variant='filled' fullWidth size='small' type='password' label='Contraseña' />
      </div>

      <div className={ styles.secondaryActions }>
        <FormControl className={ styles.formControl }>
          <FormControlLabel control={<Checkbox />} label='Recordar sesión' />
        </FormControl>
        <Typography><Link to='' className={ styles.forgotPassword }>¿Olvidó su contrasñea?</Link></Typography>
      </div>

      <div className={ styles.actionButtons }>
        <Button variant='contained'>Iniciar sesión</Button>
        <Typography>¿No tienes cuenta? <span className={ styles.redirectToRegister } onClick={ () => handleChangeTypeForm( 'REGISTER' ) }>Registrate aquí</span></Typography>
      </div>

    </form>
  </div>
);