import { createBrowserRouter, Navigate, Outlet, useNavigate } from "react-router-dom";
import { GeneralLayout, PrivateLayout, PrivateRoute, PublicLayout, PublicRoute } from "../components";
import { LoginPage } from "../pages";
import { useAuthStore, useUserStore } from "../store";


const PrivatePageExample = () => {
	const { logout } = useAuthStore();
	const { user } = useUserStore();
	const navigate = useNavigate();

	return (
		<div>
			<h1 style={{ margin: 0, }}>Private Page</h1>
			<> { console.log( { user } ) } </>
			<button onClick={ () => {
				logout();
				navigate('/');
			} }>Log out</button>
		</div>
	);
};


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
				path: "/layout",
				element: <PublicRoute><PrivateLayout><PrivatePageExample /></PrivateLayout></PublicRoute>,
				
			},
			{
				path: "/home",
				element: <PrivateRoute><PrivateLayout><PrivatePageExample /></PrivateLayout></PrivateRoute>,
			},
			{
				path: "*",
				element: <Navigate to="/" />,
			}
		]
	},
]);

export default routes;