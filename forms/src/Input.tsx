import { forwardRef, useEffect, InputHTMLAttributes, ChangeEventHandler } from 'react'
import { useForwardRef } from './useForwardRef'
import { ValidationProps } from './types'
import { useFieldManager } from './useFieldManager'

export type InputProps = ValidationProps & InputHTMLAttributes<HTMLInputElement>

type Ref = HTMLInputElement;

export const Input = forwardRef<Ref, InputProps>(({ onFieldError, fieldError, name, type, onChange, value, checked, onInvalid, ...other }, ref) => {
	const localRef = useForwardRef<Ref>(ref)

	const localSetError = (message?: string) => {
		if (onFieldError != null) onFieldError(name, localRef.current.validity, message)
	}

	const localOnChange: ChangeEventHandler<Ref> = (e) => {
		localSetError(undefined)
		e.target.setCustomValidity('')
		if (onChange != null) onChange(e)
		if (!localRef.current.validity.valid) localSetError(localRef.current.validationMessage)
	}

	const handleInvalid = (e) => {
		localSetError(e.target.validationMessage)
		if (onInvalid != null) onInvalid(e)
	}

	useEffect(() => {
		if (!localRef.current.validity.valid) localSetError(localRef.current.validationMessage)
	}, [])

	useEffect(() => {
		if (fieldError == null) return localRef.current.setCustomValidity('')
		if (fieldError.message == null) return localRef.current.setCustomValidity('')

		if (fieldError.validity?.customError && fieldError.message !== localRef.current.validationMessage) {
			localRef.current.setCustomValidity(fieldError.message)
		}
	}, [fieldError])

	return (
		<input
			ref={localRef}
			name={name}
			type={type}
			onInvalid={handleInvalid}
			{...(/checkbox|radio/i.test(type) ? { value, checked } : { value })}
			onChange={localOnChange}
			{...other}
		/>
	)
})
Input.displayName = 'Input'
Input.defaultProps = {
	type: 'text'
}

export const InputField = forwardRef<Ref, Omit<InputProps, 'DefaultValue'>>(({ type, name, onChange, value, ...other }, ref) => {
	const localRef = useForwardRef<Ref>(ref)
	const { handleChange: managerOnChange, fields, setFieldError, fieldErrors, mapError } = useFieldManager()

	const handleOnChange: ChangeEventHandler<Ref> = (e) => {
		managerOnChange(e)
		if (onChange != null) onChange(e)
	}

	const handleFieldError = (key, validity, message) => {
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
InputField.defaultProps = {
	type: 'text'
}
