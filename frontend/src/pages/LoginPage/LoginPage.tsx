import { useState } from "react";
import { Container, Login, Register } from "../../components";
import './../../style.css';
import { TypeForm } from "../../types/Login";
<<<<<<< HEAD
import styles from './Login.module.css';
=======
import styles from './LoginPage.module.css';
>>>>>>> 0a4eb8537dad1d5b62dac2392a2c5c5fc02c9232


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
