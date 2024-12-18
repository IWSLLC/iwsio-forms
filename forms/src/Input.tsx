import { ChangeEventHandler, FormEventHandler, forwardRef, InputHTMLAttributes, useCallback, useEffect } from 'react'

import { ValidationProps } from './types.js'
import { useForwardRef } from './useForwardRef.js'

export type InputProps = ValidationProps & InputHTMLAttributes<HTMLInputElement>

export type Ref = HTMLInputElement

export const Input = forwardRef<Ref, InputProps>(({ onFieldError, fieldError, name, type = 'text', onChange, value, checked, onInvalid, ...other }, ref) => {
	const localRef = useForwardRef<Ref>(ref)

	const localSetError = useCallback((message?: string) => {
		if (onFieldError != null) onFieldError(name, localRef.current.validity, message)
	}, [localRef, name, onFieldError])

	const localOnChange: ChangeEventHandler<Ref> = (e) => {
		localSetError(undefined)
		e.target.setCustomValidity('')
		if (onChange != null) onChange(e)
		if (!localRef.current.validity.valid) localSetError(localRef.current.validationMessage)
	}

	const handleInvalid: FormEventHandler<HTMLInputElement> = (e) => {
		const target = e.target as HTMLInputElement
		localSetError(target.validationMessage)
		if (onInvalid != null) onInvalid(e)
	}

	useEffect(() => {
		if (!localRef.current.validity.valid) localSetError(localRef.current.validationMessage)
	}, [localRef, localSetError])

	useEffect(() => {
		if (fieldError == null) return localRef.current.setCustomValidity('')
		if (fieldError.message == null) return localRef.current.setCustomValidity('')

		if (fieldError.validity?.customError && fieldError.message !== localRef.current.validationMessage) {
			localRef.current.setCustomValidity(fieldError.message)
		}
	}, [fieldError, localRef])

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
