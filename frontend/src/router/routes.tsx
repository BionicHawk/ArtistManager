import { createBrowserRouter, Navigate } from "react-router-dom";
import { PrivateRoute, PublicLayout, PublicRoute } from "../components";
import { LoginPage } from "../pages";
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
		element: <PrivateRoute><PrivatePageExample /></PrivateRoute>,
	},
	{
		path: "*",
		element: <Navigate to="/login" />,
	}
]);

export default routes;