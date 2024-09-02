import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const UnauthorizedPage = () => {
	const [time, setTime] = useState( 5000 );


	const navigate = useNavigate();


	useEffect( () => {
		const interval = setInterval( () => {
			setTime( time => time - 1000 );
		}, 1000 );

		setTimeout( () => {
			navigate( "/" );
		}, 5000 );

		return () => clearInterval( interval );
	}, [] )

	return (
		<div>
			<h1>Unauthorized</h1>
			<p>Redirigiendo en { time / 1000 } segundos...</p>
		</div>
	)
}
