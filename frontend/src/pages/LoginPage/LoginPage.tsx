import { useState } from "react";
import { Container, Login, Register } from "../../components";
import './../../style.css';
import { TypeForm } from "../../types/Login";
import styles from './LoginPage.module.css';


export const LoginPage = () => {
  const [typeForm, setTypeForm] = useState<TypeForm>('LOGIN');

  const handleChangeTypeForm = (formType: TypeForm) => {
		setTypeForm(formType);
  };

  return (
		<div className={ styles.loginContainer } >
			<Container className={ styles.formContainer }>
				<div className={`${styles.slideContainer} ${ typeForm === 'LOGIN' ? styles.slideRight : styles.slideLeft }`}>
						<Login handleChangeTypeForm={handleChangeTypeForm} />
						<Register handleChangeTypeForm={handleChangeTypeForm} />
				</div>
			</Container>
		</div>
  );
};
