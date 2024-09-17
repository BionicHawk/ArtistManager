import { Outlet, useNavigate } from "react-router-dom";
import { Alert } from "../../";
import { useEffect } from "react";
import { getRememberSession } from "../../../utils/saveRememberSession";
import { useAuthStore } from "../../../store";

export const GeneralLayout = () => {
	const { logout, isAuth } = useAuthStore();

	useEffect( () => {
		const rememberSession = getRememberSession();
		const existsUser = window.localStorage.getItem('user');		

		if ( !isAuth || !rememberSession || !existsUser ) {
			window.localStorage.clear();
			logout();
		}
	}, [] )



	return (
		<>
			<Outlet />
			<Alert />
		</>
	)
}
