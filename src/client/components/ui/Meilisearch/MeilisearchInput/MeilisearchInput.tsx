import React, {
	ChangeEvent,
	useId,
	useState,
} from 'react';
import {
	useSearchBox,
	UseSearchBoxProps,
} from 'react-instantsearch';

import { Icon } from '../../Icon/Icon';
import styles from './MeilisearchInput.module.scss';
import {Label} from "~/client/components/ui/Form/Label";

interface MeilisearchCustomSearchBoxProps extends Pick<React.HTMLAttributes<unknown>, 'className'> {
	id?: string
	label: string
	name: string
	labelComplement: string
	resetTitle?: string
}

export const MeilisearchInput = (props: MeilisearchCustomSearchBoxProps & UseSearchBoxProps) => {
	const {
		label,
		name,
		id: idProps,
		labelComplement,
		resetTitle,
	} = props;
	const { refine, clear, query } = useSearchBox(props);
	const internalId = useId();
	const inputId = idProps ?? internalId;

	const DEFAULT_RESET_TITLE = 'Vider le champ de recherche';
	const [value, setValue] = useState(query);

	const updateValue = (event: ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value);
		refine(event.target.value);
	};

	const resetValue = () => {
		setValue('');
		clear();
	};

	return (
		<div className="fr-input-group">
			<Label htmlFor={inputId}>
				{label}
				<Label.Complement>{labelComplement}</Label.Complement>
			</Label>
			<input
				id={inputId}
				type="text"
				name={name}
				value={value}
				onChange={updateValue}
				className="fr-input" />
			{
				!!value && (
					<button
						type="reset"
						title={resetTitle || DEFAULT_RESET_TITLE}
						onClick={() => resetValue()}
						className={styles.customSearchBoxResetButton}>
						<Icon name="close" />
					</button>
				)
			}
		</div>
	);
};
