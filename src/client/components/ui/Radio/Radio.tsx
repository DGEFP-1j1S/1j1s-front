import classNames from 'classnames';
import React, { useId } from 'react';

import styles from '~/client/components/ui/Radio/Radio.module.scss';

interface RadioProps extends Omit<React.ComponentPropsWithoutRef<'input'>, 'type'> {
  label: string;
}

export function Radio({ id: propsId, label, className, ...rest } : RadioProps) {
	const generatedId = useId();
	const id = propsId ?? generatedId;

	return (
		<div className={classNames(styles.radioButton, className)}>
			<input
				type="radio"
				{...rest}
				id={id} />
			<label htmlFor={id}>
				{label}
			</label>
		</div>
	);
}
