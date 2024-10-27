import { useParams } from "react-router-dom"

export const User = () => {
	const { userId } = useParams()

	return (
		<>
			<div>User</div>
			<div>El userId es { userId }</div>
		</>
	)
}
