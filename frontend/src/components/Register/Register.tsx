import { FormEvent, useEffect, useState } from 'react';
import UserEndpoints, { CreateUserResult } from '../../api/UserEndpoints';
import useForm from '../../hooks/useForm';
import { Button, FilledInput, FormControl, FormHelperText, Icon, IconButton, InputAdornment, InputLabel, LinearProgress, TextField, Typography, linearProgressClasses, useTheme } from '@mui/material';
import { VisibilityOff, Visibility, CheckCircle, CancelOutlined } from '@mui/icons-material';
import styles from './Register.module.css';
import { TypeForm } from '../../types/Login';
import { useAuthStore, useUserStore } from '../../store';
import { useAlert } from '../../hooks/useAlert';
import { useNavigate } from 'react-router-dom';

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
  const [passwordProgress, setPasswordProgress] = useState( 0 );
  const [reasonInvalidPassword, setReasonInvalidPassword] = useState<{ id: number, reason: string, } | null>( null );




  const { dataForm, onChangeInput, focusInput, onFocusInput, hadFocus } = useForm({
    [InputsNames.NAME]: '',
    [InputsNames.EMAIL]: '',
    [InputsNames.PASSWORD]: '',
  });

  const { login } = useAuthStore();
  const { openAlert } = useAlert();
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const theme = useTheme();




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
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
    const lengthRegex = /^.{8,}$/;
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /\d/;

    const password = dataForm.password;

    const totalCriteries = 4;

    const isLowercaseValid = lowercaseRegex.test( password );
    const isUppercaseValid = uppercaseRegex.test( password );
    const isNumberValid = numberRegex.test( password );
    const isLengthValid = lengthRegex.test( password );

    const criteriesAprobed = [isLengthValid, isLowercaseValid, isUppercaseValid, isNumberValid].reduce( (acc, isValid) => isValid ? acc + 1 : acc, 0 );

    setPasswordProgress( (criteriesAprobed / totalCriteries) * 100 );

    if( !isLowercaseValid ) {
      setReasonInvalidPassword( {
        id: InvalidPasswordReasonId.LOWERCASE,
        reason: 'La contraseña debe tener al menos una letra minúscula',
      } );
    } else if ( !isUppercaseValid ) {
      setReasonInvalidPassword( {
        id: InvalidPasswordReasonId.UPPERCASE,
        reason: 'La contraseña debe tener al menos una letra mayúscula',
      } );
    } else if ( !isNumberValid ) {
      setReasonInvalidPassword( {
        id: InvalidPasswordReasonId.NUMBER,
        reason: 'La contraseña debe tener al menos un número',
      } );
    } else if ( !isLengthValid ) {
      setReasonInvalidPassword( {
        id: InvalidPasswordReasonId.LENGTH,
        reason: 'La contraseña debe tener al menos 8 caracteres',
      } );
    } else {
      setReasonInvalidPassword( null );
    }
    


    // setReasonInvalidPassword(
    //   {
    //     ...reasonInvalidPassword[InvalidPasswordReasonId.LOWERCASE],
    //     isValid: lowercaseRegex.test( password ),
    //   },
    //   {
    //     ...reasonInvalidPassword[InvalidPasswordReasonId.UPPERCASE],
    //     isValid: uppercaseRegex.test( password ),
    //   },
    //   {
    //     ...reasonInvalidPassword[InvalidPasswordReasonId.NUMBER],
    //     isValid: numberRegex.test( password ),
    //   },
    //   {
    //     ...reasonInvalidPassword[InvalidPasswordReasonId.LENGTH],
    //     isValid: lengthRegex.test( password ),
    //   });    

    const isInvalidPassword =
      dataForm.password.match( passwordRegex ) === null
      && focusInput !== InputsNames.PASSWORD
      && hadFocus.includes( InputsNames.PASSWORD );

    if( isInvalidPassword !== invalidPassword ) setInvalidPassword( isInvalidPassword );

    return isInvalidPassword;
  }

  const handleSubmit = async ( e: FormEvent ) => {
    e.preventDefault();

    if( checkName() ) openAlert({ message: 'Nombre inválido', severity: 'error' });

    if( checkEmail() ) openAlert({ message: 'Correo electrónico inválido', severity: 'error' });

    if( checkPassword() ) openAlert({ message: 'Contraseña inválida', severity: 'error' });

    if( checkName() || checkEmail() || checkPassword() ) return;

    const result = await userEndpoints.CreateAdmin({
      email: dataForm.email,
      name: dataForm.name,
      password: dataForm.password,
    });

    if( result === CreateUserResult.OK ) {
      handleLogin();
    }
    
    if( result === CreateUserResult.USER_FOUND ) openAlert({ message: 'El correo electrónico ya está en uso.', severity: 'error' });
    
    if( result === CreateUserResult.INVALID_EMAIL ) openAlert({ message: 'Correo electrónico inválido.', severity: 'error' });
    
    if( result === CreateUserResult.INVALID_PASSWORD ) openAlert({ message: 'Contraseña inválida.', severity: 'error' });
  }

  const handleLogin = async () => {
    const response = await userEndpoints.Login( dataForm.email, dataForm.password );
    
    if( response === null ) {
      navigate('/login');
      return;
    }


    setUser( response );
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
            <InputLabel htmlFor="password-register">Contraseña</InputLabel>
            <FilledInput
              id="password-register"
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
            <LinearProgress variant="determinate" value={ passwordProgress } color={
              passwordProgress < 99 ? 'error' : 'success'
            } sx={{ width: '100%', }} />
            {
              reasonInvalidPassword !== null &&
              <span className={ styles.passwordRequirement }>
                <Typography className={ styles.textRequriement } color={ 'error' }>{ reasonInvalidPassword.reason }</Typography>
              </span>
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