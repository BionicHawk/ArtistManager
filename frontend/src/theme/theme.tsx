import { createTheme } from "@mui/material";

export const theme = createTheme({
		components: {
			MuiButton: {
				styleOverrides: {
					root: {
						color: '#261E40',
						fontWeight: '600',
					},
				},
				variants: [
					{
						props: {},
						style: {
							":hover": {
								backgroundColor: 'rgb(158 138 223)',
							},
						}
					}
				],	
			},
			// MuiTextField: {
			// 	styleOverrides: {
					
			// 	},
			// },
		},
		palette: {
			mode: 'dark',
			primary: {
				main: '#9879ff',
			},
			secondary: {
				main: '#ff76a4',
			},
			background: {
				default: '#242424',
			},
			info: {
				main: '#0288D1',
			},
			error: {
				main: '#ee4949',
			},
			warning: {
				main: '#ffa726',
			},
			success: {
				main: '#466F48',
			},
			divider: 'rgba(255,255,255,0.12)',
		},
})