import { create } from 'zustand';
import { persist } from 'zustand/middleware'
import { User } from '../interfaces';

type State = {
  user:		User | null;
}

type Action = {
	setUser:		(user: User) => void;
}

export const useUserStore = create(persist<State & Action>((set) => ({
  user: null,
	setUser: (user: User) => set(() => ({ user: user })),
}),
{
	name: 'user',
}
));