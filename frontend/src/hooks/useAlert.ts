import { Payload, useAlertStore } from "../store/useAlertStore"

export const useAlert = () => {
	const { openAlert, closeAlert } = useAlertStore();

	const handleOpenAlert = ( props: Payload ) => {
		openAlert(props);
	};

	return {
		openAlert: handleOpenAlert,
		closeAlert,
	}
}