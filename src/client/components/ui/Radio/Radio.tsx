import classNames from 'classnames';
import React, { useId } from 'react';

interface RadioProps extends Omit<React.ComponentPropsWithoutRef<'input'>, 'type'> {
  label: string;
}

export function Radio({ id: propsId, label, className, ...rest } : RadioProps) {
	const generatedId = useId();
	const id = propsId ?? generatedId;

	return (
		<div className={classNames("fr-radio-group", className)}>
			<input
				type="radio"
				{...rest}
				id={id} />
			<label className="fr-label" htmlFor={id}>
				{label}
			</label>
		</div>
	);
}
