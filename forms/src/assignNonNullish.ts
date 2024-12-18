export const assignNonNullish = <T>(...sources: Partial<T>[]) => {
	if (sources == null || sources.length === 0) throw new Error('Sources cannot be empty.')

	const result: Partial<T> = {}

	// for each source
	for (let ix = 0; ix < sources.length; ix++) {
		const source = sources[ix]
		for (const key in source) {
			if (source[key] == null) continue
			if (result[key] != null) continue // ignore pre-assigned
			result[key] = source[key]
		}
	}
	return result
}
