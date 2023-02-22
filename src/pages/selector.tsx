import { useCallback } from "react"
import styled from "styled-components/macro"

type SelectorProps<T> = {
	renderItem: (item: T) => JSX.Element
	items: T[]
	onChange: (id: string) => void
	keyExtractor: (item: T) => string
	disabledCheck: (item: T) => boolean | undefined
	current: string
}

const SelectorRow = styled.div`
	padding-bottom: 1em;
`

export function Selector<T>({
	items,
	onChange,
	renderItem,
	keyExtractor,
	disabledCheck,
}: SelectorProps<T>) {
	const onClick = useCallback(
		(id: string) => () => {
			onChange(id)
		},
		[onChange]
	)

	return (
		<div>
			{items.map((i) => (
				<SelectorRow
					onClick={!disabledCheck(i) ? onClick(keyExtractor(i)) : undefined}
					key={keyExtractor(i)}>
					{renderItem(i)}
				</SelectorRow>
			))}
		</div>
	)
}
