import { Outlet } from "react-router-dom";
import { Alert } from "../../";

export const GeneralLayout = () => {
	return (
		<>
			<Outlet />
			<Alert />
		</>
	)
}
