import { Navigate } from "react-router-dom";
import { UnauthorizedPage } from "../pages";
import { useAuthStore } from "../store";

interface PublicRouteProps {
	children: React.ReactNode | React.ReactNode[] | undefined | null;
}

export const PublicRoute = ({ children }: PublicRouteProps): JSX.Element => {
	const { isAuth } = useAuthStore();


	return (
		isAuth ? <Navigate to='/home' /> : <>{ children }</>
	);
}
