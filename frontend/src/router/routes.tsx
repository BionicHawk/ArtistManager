import { createBrowserRouter, Navigate } from "react-router-dom";
import { PrivateRoute, PublicLayout, PublicRoute } from "../components";
import { LoginPage } from "../pages";
<<<<<<< HEAD
=======
import { useAuthStore } from "../store";
import { useEffect } from "react";




const PrivatePageExample = () => {
	const { logout } = useAuthStore();
	
	// useEffect( () => {
	// 	logout();
	// }, [] )

	return (
		<div>
			<h1>Private Page</h1>
		</div>
	);
};

>>>>>>> 0a4eb8537dad1d5b62dac2392a2c5c5fc02c9232

export const routes = createBrowserRouter([
	{
		path: "/",
		element: <Navigate to="/login" />,
	},
	{
		path: "/login",
		element: <PublicRoute><PublicLayout><LoginPage /></PublicLayout></PublicRoute>,
	},
	{
		path: "/home",
<<<<<<< HEAD
		element: <PrivateRoute><div>Ruta privada</div></PrivateRoute>,
=======
		element: <PrivateRoute><PrivatePageExample /></PrivateRoute>,
>>>>>>> 0a4eb8537dad1d5b62dac2392a2c5c5fc02c9232
	},
	{
		path: "*",
		element: <Navigate to="/login" />,
	}
]);

export default routes;