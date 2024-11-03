import { createBrowserRouter, Navigate } from "react-router-dom";
import { GeneralLayout, PrivateLayout, PrivateRoute, PublicLayout, PublicRoute } from "../components";
import { Home, LoginPage, Profile, Projects, Settings, User, Users } from "../pages";
import Project from "../pages/ProjectPage/Project";


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
				path: "/project/:id",
				element: <PrivateRoute><PrivateLayout><Project /></PrivateLayout></PrivateRoute>,
			},
			{
				path: "/users",
				element: <PrivateRoute><PrivateLayout><Users /></PrivateLayout></PrivateRoute>,
			},
			{
				path: "/user/:userId",
				element: <PrivateRoute><PrivateLayout><User /></PrivateLayout></PrivateRoute>
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