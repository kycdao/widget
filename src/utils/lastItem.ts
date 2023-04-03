export function lastItem<T>(this: Array<T>) {
	return this.at(this.length - 1)
}
