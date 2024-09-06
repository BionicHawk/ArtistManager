import React from "react";

interface ContainerProps {
	children: 	React.ReactNode | React.ReactNode[];
	className?: 	string;
	style?:			React.CSSProperties;
}

export const Container = ({ children, className, style }: ContainerProps) => {
	return (
		<div className={ className } style={{ ...containerStyles, ...style }}>
			{ children }
		</div>
	)
};

const containerStyles: React.CSSProperties = {
<<<<<<< HEAD
	backgroundColor: 'rgba(255, 255, 255, 0.14)',
=======
	backgroundColor: 'rgba(0, 0, 0, 0.14)',
>>>>>>> 0a4eb8537dad1d5b62dac2392a2c5c5fc02c9232
	borderRadius: 24,
	// backdropFilter: 'blur(0px)',
};