import { FormEvent, useEffect, useState } from 'react';
import UserEndpoints, { CreateUserResult } from '../../api/UserEndpoints';
import useForm from '../../hooks/useForm';
import { Button, FilledInput, FormControl, FormHelperText, Icon, IconButton, InputAdornment, InputLabel, TextField, Typography } from '@mui/material';
import { VisibilityOff, Visibility, CheckCircle, CancelOutlined } from '@mui/icons-material';
import styles from './Register.module.css';
import { TypeForm } from '../../types/Login';
import { useAuthStore, useUserStore } from '../../store';

interface RegisterProps {
  handleChangeTypeForm: (type: TypeForm) => void;
}

enum InputsNames {
  NAME = 'name',
  EMAIL = 'email',
  PASSWORD = 'password',
}

enum InvalidPasswordReasonId {
  LENGTH,
  LOWERCASE,
  UPPERCASE,
  NUMBER,
}


export const Register = ({ handleChangeTypeForm }: RegisterProps) => {
  const userEndpoints = new UserEndpoints();
  
  
  const [showPassword, setShowPassword] = useState( false );
  const [invalidEmail, setInvalidEmail] = useState( false );
  const [invalidPassword, setInvalidPassword] = useState( false );
  const [reasonInvalidPassword, setReasonInvalidPassword] = useState( [
    {
      id: InvalidPasswordReasonId.LENGTH,
      reason: 'La contraseña debe tener 8 carácteres',
      isValid: false,
    },
    {
      id: InvalidPasswordReasonId.LOWERCASE,
      reason: 'La contraseña debe tener al menos una letra minúscula',
      isValid: false,
    },
    {
      id: InvalidPasswordReasonId.UPPERCASE,
      reason: 'La contraseña debe tener al menos una letra mayúscula',
      isValid: false,
    },
    {
      id: InvalidPasswordReasonId.NUMBER,
      reason: 'La contraseña debe tener al menos un número',
      isValid: false,
    },
  ] );




  const { dataForm, onChangeInput, focusInput, onFocusInput, hadFocus } = useForm({
    [InputsNames.NAME]: '',
    [InputsNames.EMAIL]: '',
    [InputsNames.PASSWORD]: '',
  });

  const { login } = useAuthStore();
  const { setUser } = useUserStore();




  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const checkName = () => {
    const isInvalidName = dataForm.name.length === 0;
    
    return isInvalidName;
  }

  const checkEmail = () => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    const isInvalidEmail =
      dataForm.email.match( emailRegex ) === null
      && focusInput !== InputsNames.EMAIL
      && hadFocus.includes( InputsNames.EMAIL );

    if( isInvalidEmail !== invalidEmail ) setInvalidEmail( isInvalidEmail );

    return isInvalidEmail;
  }

  const checkPassword = () => {
    const lengthRegex = /^.{8,}$/;
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /\d/;

    const password = dataForm.password;

    setReasonInvalidPassword( [
      {
        ...reasonInvalidPassword[InvalidPasswordReasonId.LENGTH],
        isValid: lengthRegex.test( password ),
      },
      {
        ...reasonInvalidPassword[InvalidPasswordReasonId.LOWERCASE],
        isValid: lowercaseRegex.test( password ),
      },
      {
        ...reasonInvalidPassword[InvalidPasswordReasonId.UPPERCASE],
        isValid: uppercaseRegex.test( password ),
      },
      {
        ...reasonInvalidPassword[InvalidPasswordReasonId.NUMBER],
        isValid: numberRegex.test( password ),
      },
    ] );

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

    const isInvalidPassword =
      dataForm.password.match( passwordRegex ) === null
      && focusInput !== InputsNames.PASSWORD
      && hadFocus.includes( InputsNames.PASSWORD );

    if( isInvalidPassword !== invalidPassword ) setInvalidPassword( isInvalidPassword );

    return isInvalidPassword;
  }

  const handleSubmit = async ( e: FormEvent ) => {
    e.preventDefault();

    if( checkName() ) alert( 'Nombre inválido' );

    if( checkEmail() ) alert( 'Correo electrónico inválido' );

    if( checkPassword() ) alert( 'Contraseña inválida' );

    if( checkName() || checkEmail() || checkPassword() ) return;

    // TODO: Quitar este console.log
    console.log({ 
      email: dataForm.email,
      name: dataForm.name,
      password: dataForm.password
    })

    const result = await userEndpoints.CreateAdmin({
      email: dataForm.email,
      name: dataForm.name,
      password: dataForm.password,
    });

    // FIXME: No funciona user_found
    if( result === CreateUserResult.OK ) {
      handleLogin();
    } else if( result === CreateUserResult.USER_FOUND ) {
      alert( 'El usuario ya existe' );
    } else if( result === CreateUserResult.INVALID_EMAIL ) {
      alert( 'Correo electrónico inválido' );
    } else if( result === CreateUserResult.INVALID_PASSWORD ) {
      alert( 'Contraseña inválida' );
    }
  }

  const handleLogin = () => {
    // TODO: Hacer set del usuario en el store
    login();
  };





  // Valida los inputs al cambiar de focus
  useEffect( () => {
    checkEmail();
    checkPassword();
  }, [onFocusInput] )


  return (
    <div className={ styles.formContainer }>
      <form className={ styles.form } onSubmit={ handleSubmit }>
        <Typography variant='h4' fontWeight='lighter' className={ styles.title }>Registro</Typography>
        <div className={ styles.textfields }>
          <TextField
            variant='filled'
            fullWidth
            size='small'
            type='text'
            label='Nombre completo'
            placeholder='P. ej. Juan Rodríguez Pérez'
            name={ InputsNames.NAME }
            value={ dataForm.name }
            onChange={ onChangeInput }
            onFocus={ onFocusInput }
            />
          <TextField
            fullWidth
            variant='filled'
            size='small'
            type='email'
            label='Correo electrónico'
            placeholder='ejemplo@correo.com'
            name={ InputsNames.EMAIL }
            value={ dataForm.email }
            onChange={ onChangeInput }
            onFocus={ onFocusInput }
            error={ invalidEmail }
            helperText={ invalidEmail ? 'Correo electrónico inválido' : '' }
          />
          <FormControl variant="filled">
            <InputLabel htmlFor="password">Contraseña</InputLabel>
            <FilledInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              size='small'
              name={ InputsNames.PASSWORD }
              value={ dataForm.password }
              onChange={ onChangeInput }
              onFocus={ onFocusInput }
              error={ invalidPassword }
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
            { invalidPassword && <FormHelperText error>Contraseña inválida</FormHelperText> }
          </FormControl>

          <div className={ styles.passwordRequirements }>
            { reasonInvalidPassword.map( (reason, index) => (
              <span className={ styles.passwordRequirement } key={ index }>
                <Icon className={ styles.icon }>
                  {
                    reason.isValid
                      ? <CheckCircle className={ styles.icon } color='success' />
                      : <CancelOutlined className={ styles.icon } color='error' />
                  }
                </Icon>
                <Typography className={ styles.textRequriement } color={ reason.isValid ? 'success' : 'error' }>{ reason.reason }</Typography>
              </span> ) )
            }
          </div>
        </div>        

        <div className={ styles.actionButtons }>
          <Button variant='contained' type='submit' onClick={ handleSubmit }>Registrarse</Button>
          <Typography>¿Ya tienes cuenta? <span className={ styles.redirectToRegister } onClick={ () => handleChangeTypeForm( 'LOGIN' ) }>Inicia sesión</span></Typography>
        </div>

      </form>
    </div>
  )
};