import classNames from 'classnames';
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

interface MeilisearchCustomSearchBoxProps extends Pick<React.HTMLAttributes<unknown>, 'className'> {
	id?: string
	label: string
	name: string
	placeholder: string
	resetTitle?: string
}

export const MeilisearchInput = (props: MeilisearchCustomSearchBoxProps & UseSearchBoxProps) => {
	const {
		label,
		name,
		id: idProps,
		placeholder,
		resetTitle,
		className,
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
		<div className={classNames(className)}>
			<label className={styles.label} htmlFor={inputId}>{label}</label>
			<span className={styles.customSearchBoxInputWrapper}>
				<input
					id={inputId}
					type="text"
					name={name}
					placeholder={placeholder}
					value={value}
					onChange={updateValue}
					className={styles.customSearchBoxInput} />
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
			</span>
		</div>
	);
};
