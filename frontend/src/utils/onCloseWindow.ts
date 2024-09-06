// TODO: Check if this is working as expected

window.document.addEventListener( 'DOMContentLoaded', () => {
	window.onbeforeunload = function () {
		(window as Window).localStorage.clear();
	};
} );

export {};