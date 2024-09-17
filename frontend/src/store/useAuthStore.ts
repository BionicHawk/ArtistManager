import { create } from 'zustand';
import { persist } from 'zustand/middleware'
import { useUserStore } from './useUserStore';

type State = {
  isAuth:		Boolean;
}

type Action = {
	login: 		() => void;
	logout: 	() => void;
}

export const useAuthStore = create(persist<State & Action>((set) => ({
  isAuth: false,
  login: () => set(() => ({ isAuth: true })),
	logout: () => {
		useUserStore.getState().deleteUser();
		set(() => ({ isAuth: false }))
	},
}),
{
	name: 'isAuth',
}
));