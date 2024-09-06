import { useState } from "react";

export const useForm = <T extends Object>( initialValues: T ) => {
		const [values, setValues] = useState( initialValues );

		const clearForm = () => setValues( initialValues );

		return [
				values,
				( e: React.ChangeEvent<HTMLInputElement> ) => {
						setValues({
								...values,
								[e.target.name]: e.target.value
						});
				},
				clearForm,
		];
};

export default useForm;