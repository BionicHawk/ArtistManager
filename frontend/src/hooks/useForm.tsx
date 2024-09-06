import { FocusEventHandler, useState } from "react";

export const useForm = <T extends Object>( initialValues: T ) => {
	const [dataForm, setDataForm] = useState( initialValues );
	const [focusInput, setFocusInput] = useState<string | null>( null );
	const [hadFocus, setHadFocus] = useState<string[]>( [] );

	const onChangeInput = ({ target }: { target: EventTarget & (HTMLInputElement | HTMLTextAreaElement) }) => {
			const { name, value } = target;
			setDataForm({
					...dataForm,
					[name]: value,
			});
	};

	const onFocusInput: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
		const { name } = event.target;
		setFocusInput( name );

		if( !hadFocus.includes( name ) ) setHadFocus( [...hadFocus, name] );
};

	const clearForm = () => {
		setDataForm( initialValues );
		setFocusInput( null );
	};

	return {
			dataForm,
			setDataForm,
			onChangeInput,
			clearForm,
			focusInput,
			onFocusInput,
			hadFocus, // Para implementar hadFocus, el input debe tener el evento focus con onFocusInput
	};
};

export default useForm;