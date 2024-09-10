import { create } from 'zustand';

export interface Payload {
	message: string;
	duration?: number;
	position?: {
		vertical: 'top' | 'bottom';
		horizontal: 'left' | 'center' | 'right';
	};
	severity?: 'error' | 'warning' | 'info' | 'success';
	variant?: 'filled' | 'outlined' | 'standard';
}

type State = {
	message: string;
	open: boolean;
	duration: number;
	position: {
		vertical: 'top' | 'bottom';
		horizontal: 'left' | 'center' | 'right';
	};
	severity: 'error' | 'warning' | 'info' | 'success';
	variant: 'filled' | 'outlined' | 'standard';
}

type Action = {
	openAlert: ( payload: Payload ) => void;
	closeAlert: () => void;
}

export const useAlertStore = create<State & Action>((set) => ({
	open: false,
	duration: 5000,
	position: {
		vertical: 'top',
		horizontal: 'right',
	},
	severity: 'info',
	message: '',
	variant: 'filled',
	openAlert: ( payload: Payload ) => set(() => ({
		open: true,
		message: payload.message,
		duration: payload?.duration || 3000,
		position: payload?.position || { vertical: 'top', horizontal: 'right' },
		severity: payload?.severity || 'info',
		variant: payload?.variant || 'filled',
	})),
	closeAlert: () => set(() => ({
		open: false,
	})),
}));