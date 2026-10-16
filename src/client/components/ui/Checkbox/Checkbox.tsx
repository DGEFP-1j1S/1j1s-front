import classNames from 'classnames';
import React, { useId } from 'react';

import styles from '~/client/components/ui/Checkbox/Checkbox.module.scss';

type CheckboxProps = React.ComponentPropsWithoutRef<'input'> & {
  label: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
	{ id: idProps, label, className, ...rest  }
	, ref,
) {
	const idState = useId();
	const id = idProps ?? idState;

	return (
		<div className={classNames(styles.checkbox, className)}>
			<input
				type="checkbox"
				id={id}
				ref={ref}
				{...rest} />
			<label className={styles.label} htmlFor={id}>{label}</label>
		</div>
	);
});
