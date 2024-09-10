import { useState } from "react"
import { Snackbar, Alert as MuiAlert } from "@mui/material"
import { useAlertStore } from "../../store/useAlertStore"

export const Alert = () => {
	const { open, message, closeAlert, duration, severity, variant } = useAlertStore();

	return (
		<>
			<Snackbar open={ open } autoHideDuration={ duration } onClose={ closeAlert }>
				<MuiAlert
					onClose={ closeAlert }
					severity={ severity }
					variant={ variant }
				>
					{ message }
				</MuiAlert>
			</Snackbar>
		</>
	)
}
