export function saveRemeberSession( value: boolean ) {
	const parsedValue = String(value);
	
	window.localStorage.setItem('rememberSession', parsedValue);
	
	if( !value ) return;
	
	const currentDate = new Date();
	const rememberDays = 7;

	currentDate.setDate(currentDate.getDate() + rememberDays);

	window.localStorage.setItem('expiresIn', currentDate.toString());
}

export function getRememberSession() {
	const value = window.localStorage.getItem('rememberSession');
	return value === 'true';
}