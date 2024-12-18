import { ChangeEventHandler, forwardRef } from 'react'

import { Input, InputProps, Ref } from './Input.js'
import { FieldChangeEventHandler, FieldErrorHandler } from './types.js'
import { useFieldManager } from './useFieldManager.js'
import { useForwardRef } from './useForwardRef.js'

export type InputFieldProps = Omit<InputProps, 'DefaultValue' | 'onChange'> & { onChange?: FieldChangeEventHandler }

export const InputField = forwardRef<Ref, InputFieldProps>(({ type = 'text', name, onChange, value, ...other }, ref) => {
	const localRef = useForwardRef<Ref>(ref)
	const { handleChange: managerOnChange, fields, setFieldError, fieldErrors, mapError } = useFieldManager()

	const handleOnChange: ChangeEventHandler<Ref> = (e) => {
		const result = managerOnChange<HTMLInputElement>(e)
		if (onChange != null) onChange(result)
	}

	const handleFieldError: FieldErrorHandler = (key, validity, message) => {
		const mappedError = mapError(validity, message)
		setFieldError(key, mappedError, validity)
	}

	return (
		<Input
			ref={localRef}
			onChange={handleOnChange}
			{...(/checkbox|radio/i.test(type) ? { value, checked: fields[name] === value } : { value: fields[name] })}
			type={type}
			name={name}
			fieldError={fieldErrors[name]}
			onFieldError={handleFieldError}
			{...other}
		/>
	)
})

InputField.displayName = 'InputField'
