import { Payload, useAlertStore } from "../store/useAlertStore"

export const useAlert = ( props: Payload) => {
	const { openAlert, closeAlert } = useAlertStore();

	const handleOpenAlert = () => {
		openAlert(props);
	};

	return {
		openAlert: handleOpenAlert,
		closeAlert,
	}
}