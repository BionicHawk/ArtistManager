import { Button, TextField } from "@mui/material";
import { TypeForm } from "../../types/Login";
import styles from './Login.module.css';

export const Login = ({ handleChangeTypeForm }: { handleChangeTypeForm: (type: TypeForm) => void; }) => (
  <div className={ styles.formContainer }>
    <form className={ styles.form }>
      <h2 className={ styles.h2 }>Registro</h2>
      <p className={ styles.p }>Inicie sesión</p>
      <TextField variant='filled' fullWidth size='small' type="password" label="Email" />
      <TextField variant='filled' fullWidth size='small' type="password" label="Password" />
      <Button variant='contained' size="medium" onClick={() => handleChangeTypeForm('REGISTER')}>Go to Register</Button>

    </form>
  </div>
);