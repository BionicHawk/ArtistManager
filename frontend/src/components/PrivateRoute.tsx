import { UnauthorizedPage } from "../pages";
import { useAuthStore } from "../store";

interface PrivateRouteProps {
	children: React.ReactNode | React.ReactNode[];
}

export const PrivateRoute = ({ children }: PrivateRouteProps): JSX.Element => {
	const { isAuth } = useAuthStore();

	return (
		isAuth ? <>{ children }</> : <UnauthorizedPage />
	);
}
