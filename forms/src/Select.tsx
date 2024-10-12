import { ChangeEventHandler, FormEventHandler, forwardRef, PropsWithChildren, SelectHTMLAttributes, useCallback, useEffect } from 'react'

import { ValidationProps } from './types.js'
import { useForwardRef } from './useForwardRef.js'

export type SelectProps = PropsWithChildren<SelectHTMLAttributes<HTMLSelectElement>> & ValidationProps

export type Ref = HTMLSelectElement

export const Select = forwardRef<Ref, SelectProps>(({ onFieldError, onInvalid, fieldError, name, onChange, value, children, ...other }, ref) => {
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

	const handleInvalid: FormEventHandler<HTMLSelectElement> = (e) => {
		const target = e.target as HTMLSelectElement
		localSetError(target.validationMessage)
		if (onInvalid != null) onInvalid(e)
	}

	useEffect(() => {
		if (!localRef.current.validity.valid) localSetError(localRef.current.validationMessage)
	}, [localRef, localSetError])

	useEffect(() => {
		if (fieldError == null) return localRef.current.setCustomValidity('')
		if (fieldError.validity?.customError && fieldError.message !== localRef.current.validationMessage) {
			localRef.current.setCustomValidity(fieldError.message || '')
		}
	}, [fieldError, localRef])

	return (
		<select
			ref={localRef}
			name={name}
			value={value}
			onInvalid={handleInvalid}
			onChange={localOnChange}
			{...other}
		>
			{children}
		</select>
	)
})
Select.displayName = 'Select'
