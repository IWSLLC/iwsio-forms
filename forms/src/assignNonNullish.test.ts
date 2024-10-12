import { assignNonNullish } from './assignNonNullish.js'

type Numbers = { four?: { four: number, five?: number }, one: number, two?: number, three?: string }

describe('defaults', () => {
	test('basic flat object', async () => {
		const result = assignNonNullish<Numbers>({ one: 1, two: 2, three: 'three' })
		expect(result).to.deep.eq({ one: 1, two: 2, three: 'three' })
	})

	test('inferred type check', async () => {
		const result = assignNonNullish<Numbers>({}, { two: 2, three: 'three' })
		expect(result).to.deep.eq({ two: 2, three: 'three' })
	})

	test('shallow defaults', async () => {
		const four = { four: 4 }
		const result = assignNonNullish<Numbers>({ four }, { one: 1, two: 2, three: 'three', four: { four: 4, five: 5 } })
		expect(result).to.deep.eq({ one: 1, two: 2, three: 'three', four: { four: 4 } })
		expect(result.four).to.equal(four) // strict equal by ref
		expect(result.four.five).to.not.be.ok
	})

	test('deep object (value null), shallow defaults', async () => {
		const four = { four: 4, five: 5 }
		const result = assignNonNullish({}, { one: 1, two: 2, three: 'three', four })
		expect(result).to.deep.eq({ one: 1, two: 2, three: 'three', four: { four: 4, five: 5 } })
		expect(result.four).to.equal(four) // strict equal by ref
		expect(result.four.five).to.be.ok
	})
})
