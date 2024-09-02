import styles from './PublicLayout.module.css';

interface PublicLayoutProps {
	children: React.ReactNode | React.ReactNode[] | undefined | null;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
	return (
		<div className={ styles.container }>
			{ children }
		</div>
	)
}
