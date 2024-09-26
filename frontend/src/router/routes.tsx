import { createBrowserRouter, Navigate, Outlet, useNavigate } from "react-router-dom";
import { GeneralLayout, PrivateLayout, PrivateRoute, PublicLayout, PublicRoute } from "../components";
import { Home, LoginPage, Profile, Projects, Settings, Users } from "../pages";
import { useAuthStore, useUserStore } from "../store";


export const routes = createBrowserRouter([
	{
		element: <GeneralLayout />,
		children: [
			{
				path: "/",
				element: <Navigate to="/login" />,
				index: true,
			},
			{
				path: "/login",
				element: <PublicRoute><PublicLayout><LoginPage /></PublicLayout></PublicRoute>,
				
			},
			{
				path: "/home",
				element: <PrivateRoute><PrivateLayout><Home /></PrivateLayout></PrivateRoute>,
			},
			{
				path: "/projects",
				element: <PrivateRoute><PrivateLayout><Projects /></PrivateLayout></PrivateRoute>,
			},
			{
				path: "/users",
				element: <PrivateRoute><PrivateLayout><Users /></PrivateLayout></PrivateRoute>,
			},
			{
				path: "/profile",
				element: <PrivateRoute><PrivateLayout><Profile /></PrivateLayout></PrivateRoute>,
			},
			{
				path: "/settings",
				element: <PrivateRoute><PrivateLayout><Settings /></PrivateLayout></PrivateRoute>,
			},
			{
				path: "*",
				element: <Navigate to="/" />,
			}
		]
	},
]);

export default routes;