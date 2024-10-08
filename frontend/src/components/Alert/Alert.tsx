import { useState } from "react"
import { Snackbar, Alert as MuiAlert } from "@mui/material"
import { useAlertStore } from "../../store/useAlertStore"

export const Alert = () => {
	const { open, message, closeAlert, duration, severity, variant, position } = useAlertStore();

	return (
		<>
			<Snackbar open={ open } autoHideDuration={ duration } onClose={ closeAlert } anchorOrigin={ position }>
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
