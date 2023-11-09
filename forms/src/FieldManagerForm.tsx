import { forwardRef } from 'react'
import { useFieldManager } from './useFieldManager'
import { ValidatedForm, ValidatedFormProps } from './ValidatedForm'

export type ManagedValidatedFormProps = Omit<ValidatedFormProps, 'onValidSubmit'>

export const FieldManagerForm = forwardRef<HTMLFormElement, ManagedValidatedFormProps>(({ children, ...props }, ref) => {
	const { fields, onValidSubmit } = useFieldManager()
	const handleLocalValidSubmit = () => {
		if (onValidSubmit != null) {
			onValidSubmit(fields)
		}
	}
	return <ValidatedForm ref={ref} {...props} onValidSubmit={handleLocalValidSubmit}>{children}</ValidatedForm>
})

FieldManagerForm.displayName = 'FieldManagerForm'

FieldManagerForm.defaultProps = {
	reportValidity: false,
	nativeValidation: false,
	className: ''
}