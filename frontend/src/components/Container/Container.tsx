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
	backgroundColor: 'rgba(0, 0, 0, 0.6)',
	borderRadius: 24,
};