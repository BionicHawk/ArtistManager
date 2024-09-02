import { createBrowserRouter, Navigate } from "react-router-dom";
import { PrivateRoute, PublicLayout, PublicRoute } from "../components";
import { LoginPage } from "../pages";

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
		element: <PrivateRoute><div>Ruta privada</div></PrivateRoute>,
	},
	{
		path: "*",
		element: <Navigate to="/login" />,
	}
]);

export default routes;