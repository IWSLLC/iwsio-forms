import { ChangeEventHandler, FormEventHandler, forwardRef, TextareaHTMLAttributes, useCallback, useEffect } from 'react'

import { ValidationProps } from './types.js'
import { useForwardRef } from './useForwardRef.js'

export type TextAreaProps = ValidationProps & TextareaHTMLAttributes<HTMLTextAreaElement>

export type Ref = HTMLTextAreaElement

export const TextArea = forwardRef<Ref, TextAreaProps>(({ onFieldError, onInvalid, fieldError, name, onChange, value, ...other }, ref) => {
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

	const handleInvalid: FormEventHandler<HTMLTextAreaElement> = (e) => {
		const target = e.target as HTMLTextAreaElement
		localSetError(target.validationMessage)
		if (onInvalid != null) onInvalid(e)
	}

	useEffect(() => {
		if (!localRef.current.validity.valid) localSetError(localRef.current.validationMessage)
	}, [localRef, localSetError])

	useEffect(() => {
		if (fieldError == null) return localRef.current.setCustomValidity('') // clear it.
		if (fieldError.validity?.customError && fieldError.message !== localRef.current.validationMessage) {
			localRef.current.setCustomValidity(fieldError.message || '')
		}
	}, [fieldError, localRef])

	return (
		<textarea
			ref={localRef}
			name={name}
			value={value}
			onInvalid={handleInvalid}
			onChange={localOnChange}
			{...other}
		/>
	)
})

TextArea.displayName = 'TextArea'
