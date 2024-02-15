import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useFieldState } from './useFieldState'
import { ControlledFieldManager, FieldManager } from './FieldManager'
import { Input, InputField } from './Input'

describe('FieldManager', () => {
	test('When rendering field manager with fields; happy path', async () => {
		const Test = () => {
			return <FieldManager fields={{ field: '' }}><Input data-testid="field" name="field" /></FieldManager>
		}
		const { container } = render(<Test />)

		const input = screen.getByTestId('field') as HTMLInputElement
		expect(input.value).to.eq('')

		await act(async () => {
			await userEvent.type(input, '123')
		})

		expect(input.value).to.eq('123') // bindings made, state updated and the input is controlled
		expect(container.querySelector('form[errorMapping="*"]')).toBeFalsy()
	})

	test('When rendering field manager with no fields', async () => {
		const Test = () => {
			return <FieldManager fields={{ field: '' }} />
		}
		const { container } = render(<Test />)

		expect(container.textContent).to.eq('')
	})

	test('When rendering field manager with mismatching field state', async () => {
		const Test = () => {
			return <FieldManager fields={{ field: '' }}><Input data-testid="field2" name="field2" /></FieldManager>
		}
		render(<Test />)

		const input = screen.getByTestId('field2') as HTMLInputElement
		expect(input.value).to.eq('')

		await act(async () => {
			await userEvent.type(input, '123')
		})

		expect(input.value).to.eq('123') // bindings made, state updated and the input is controlled
	})
})

describe('ControlledFieldManager', () => {
	test('When rendering field manager with fields; happy path', async () => {
		const Test = () => {
			const fieldState = useFieldState({ field: '' })
			return <ControlledFieldManager fieldState={fieldState}><InputField data-testid="field" name="field" /></ControlledFieldManager>
		}
		render(<Test />)

		const input = screen.getByTestId('field') as HTMLInputElement
		expect(input.value).to.eq('')

		await act(async () => {
			await userEvent.type(input, '123')
		})

		expect(input.value).to.eq('123') // bindings made, state updated and the input is controlled
	})

	test('When rendering field manager with no fields', async () => {
		const Test = () => {
			const fieldState = useFieldState({ field: '' })
			return <ControlledFieldManager fieldState={fieldState} />
		}
		const { container } = render(<Test />)

		expect(container.textContent).to.eq('')
	})

	test('When rendering field manager with manually controlled field', async () => {
		const Test = () => {
			const fieldState = useFieldState({ field1: '' })
			const { handleChange } = fieldState
			return <ControlledFieldManager fieldState={fieldState}><Input data-testid="field1" name="field1" onChange={handleChange} value={fieldState.fields.field1} /></ControlledFieldManager>
		}
		render(<Test />)

		// input field2 is an uncontrolled field in this case.
		const input = screen.getByTestId('field1') as HTMLInputElement
		expect(input.value).to.eq('')

		await act(async () => {
			await userEvent.type(input, '123')
		})

		expect(input.value).to.eq('123') // bindings made, state updated and the input is controlled
	})

	test('When rendering field manager with uncontrolled field', async () => {
		const Test = () => {
			const fieldState = useFieldState({ field: '' })
			return <ControlledFieldManager fieldState={fieldState}><Input data-testid="field2" name="field2" /></ControlledFieldManager>
		}
		render(<Test />)

		// input field2 is an uncontrolled field in this case.
		const input = screen.getByTestId('field2') as HTMLInputElement
		expect(input.value).to.eq('')

		await act(async () => {
			await userEvent.type(input, '123')
		})

		expect(input.value).to.eq('123') // field still works as normal
	})

	test('When rendering field manager with fields and error mapping; should not render component attributes', async () => {
		const Test = () => {
			const fieldState = useFieldState({ field: '' }, undefined, undefined, { customError: 'failed' } as any)
			return <ControlledFieldManager fieldState={fieldState} data-testid="form"><Input data-testid="field" name="field" /><button type="submit" data-testid="submit">submit</button></ControlledFieldManager>
		}
		const { container } = render(<Test />)

		await userEvent.click(screen.getByTestId('submit'))

		expect(container.querySelector('form[errorMapping]')).toBeFalsy()
		expect(screen.getByTestId('form')).toBeTruthy()
	})
})
