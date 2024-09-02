import { Button, TextField } from "@mui/material";
import { TypeForm } from "../../types/Login";
import styles from './Register.module.css';

export const Register = ({ handleChangeTypeForm }: { handleChangeTypeForm: (type: TypeForm) => void; }) => (
  <div className={ styles.formContainer }>
    <form className={ styles.form }>
      <h2 className={ styles.h2 }>Registro</h2>
      <p className={ styles.p }>Ingrese sus datos</p>
      <TextField variant='filled' fullWidth size='small' label="Nombre" />
      <TextField variant='filled' fullWidth size='small' label="Email" />
      <TextField variant='filled' fullWidth size='small' label="Contraseña" />
      <TextField variant='filled' fullWidth size='small' label="Repetir contraseña" />
      <div></div>
      <Button variant='contained' onClick={() => handleChangeTypeForm('LOGIN')}>Go to Login</Button>
    </form>
  </div>
);