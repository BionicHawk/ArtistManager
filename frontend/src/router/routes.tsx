import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { GeneralLayout, PrivateRoute, PublicLayout, PublicRoute } from "../components";
import { LoginPage } from "../pages";
import { useAuthStore } from "../store";
import { useEffect } from "react";




const PrivatePageExample = () => {
	return (
		<div>
			<h1>Private Page</h1>
		</div>
	);
};


export const routes = createBrowserRouter([
	{
		// path: "/",
		element: <GeneralLayout />,
		children: [
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
		]
		// element: <Navigate to="/login" />,
	},
]);

export default routes;