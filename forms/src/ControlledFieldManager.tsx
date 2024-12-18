import { forwardRef } from 'react'

import { FieldManagerProps } from './FieldManager.js'
import { FieldManagerContext } from './FieldManagerContext.js'
import { FieldManagerForm } from './FieldManagerForm.js'
import { useFieldState } from './useFieldState.js'

export type ControlledFieldManagerProps = Omit<FieldManagerProps, 'fields' | 'defaultValues'> & { fieldState: ReturnType<typeof useFieldState> }

/**
 * Use this component if you want to manage field state remotely. This is useful when you're setting up form context elswhere and want the field values to change from outside input interactions.
 */
export const ControlledFieldManager = forwardRef<HTMLFormElement, ControlledFieldManagerProps>(({ children, fieldState, ...props }, ref) => {
	return (
		<FieldManagerContext.Provider value={fieldState}>
			<FieldManagerForm ref={ref} {...props}>
				{children}
			</FieldManagerForm>
		</FieldManagerContext.Provider>
	)
})

ControlledFieldManager.displayName = 'ControlledFieldManager'
