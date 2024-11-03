import { Close } from "@mui/icons-material"
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material"
import React from "react"

interface ModalProps {
	open: boolean
	handleClose: () => void
	children: React.ReactNode | React.ReactNode[]
	title: React.ReactNode | React.ReactNode[]
}

export const Modal = ({ children, title, open, handleClose }: ModalProps) => {
	return (
		<Dialog onClose={handleClose} open={open} sx={{ padding: 4 }}>
			<IconButton onClick={ handleClose } sx={{ position: 'absolute', top: 8, right: 8, }}><Close /></IconButton>
			<DialogTitle>{title}</DialogTitle>

			<DialogContent>
				{ children }
			</DialogContent>
    </Dialog>
	)
}
