import React, { useCallback, useMemo } from 'react';
import { useRefinementList, UseRefinementListProps } from 'react-instantsearch';

import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { SelectMultiple } from '~/client/components/ui/Form/Select/SelectMultiple';
import { getCapitalizedItems } from '~/client/components/ui/Meilisearch/getCapitalizedItems';

type MeilisearchSelectMultipleProps = Partial<Pick<HTMLElement, 'className'>> & {
	label: string
}

export function MeilisearchSelectMultiple(props: UseRefinementListProps & MeilisearchSelectMultipleProps) {
	const { refine, items } = useRefinementList(props);
	const { label, className } = props;

	const valuesSelected = useMemo(() => {
		return items.filter((item) => item.isRefined)
			.map((item) => item.value);
	}, [items]);

	const onOptionSelected = useCallback((option: HTMLElement) => {
		const value = option.getAttribute('data-value');
		if (value) refine(value);
	}, [refine]);

	return (
		<Champ className={className}>
			<Champ.Label>
				{label}
			</Champ.Label>
			<Champ.Input
				render={SelectMultiple}
				onChange={onOptionSelected}
				value={valuesSelected}
				optionsAriaLabel={label}>
				{items.map((option) =>
					<SelectMultiple.Option key={option.value} value={option.value}>{getCapitalizedItems(option.label)}</SelectMultiple.Option>,
				)}
			</Champ.Input>
			<Champ.Error />
		</Champ>
	);
}
