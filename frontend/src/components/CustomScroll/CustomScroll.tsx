interface CustomScrollProps {
	children: React.ReactNode | React.ReactNode[];
}

export const CustomScroll = ({ children }: CustomScrollProps) => {
	return (
		<div
			className='custom-scroll'
			style={{
				height: '100%',
				overflow: 'auto',
				padding: '0 16px',
			}}
		>
			{ children }
		</div>
	)
}
