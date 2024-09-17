import { Container } from '../..';
import styles from './PrivateLayout.module.css';

interface PrivateLayoutProps {
	children: React.ReactNode | React.ReactNode[];
}

export const PrivateLayout = ({ children }: PrivateLayoutProps) => {
	return (
		<div className={ styles.layout }>
			<header className={ styles.header }>
				<Container style={{ borderRadius: 16, height: '100%' }}>
					Prueba
				</Container>
			</header>
			
			<main className={ styles.main }>
				<Container style={{ borderRadius: 16, height: '100%', width: '100%', }}>
					{ children }
				</Container>

			</main>

			<aside className={ styles.aside }>
				<Container style={{ borderRadius: 16, height: '100%' }}>
					adas
				</Container>
			</aside>
		</div>
	)
}
