import { FC, PropsWithChildren } from 'react'

import { FieldManager } from '../FieldManager.js'

export const FieldManagerWrapper: FC<PropsWithChildren> = ({ children }) => (
	<FieldManager fields={{ field: '' }}>
		{children}
	</FieldManager>
)
