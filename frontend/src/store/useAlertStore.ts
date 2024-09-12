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
	openAlert: ( payload: Payload ) => set(( state ) => ({
		open: true,
		message: payload.message,
		duration: payload?.duration || state.duration,
		position: payload?.position || state.position,
		severity: payload?.severity || state.severity,
		variant: payload?.variant || state.variant,
	})),
	closeAlert: () => set(() => ({
		open: false,
	})),
}));