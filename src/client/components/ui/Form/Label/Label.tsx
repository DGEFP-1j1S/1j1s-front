import classNames from 'classnames';
import React, { ComponentPropsWithoutRef } from 'react';

import styles from './Label.module.scss';

type LabelProps = ComponentPropsWithoutRef<'label'> & {
	label?: string
}

export function Label({ className, children, ...rest }: LabelProps) {
	return (
		<label className={classNames(styles.label, className)} {...rest}>
			{children}
		</label>
	);
}

type ComplementProps = ComponentPropsWithoutRef<'small'>

function Complement({ className, ...props }: ComplementProps) {
	return <small className={classNames(styles.complement, className)} {...props} />;
}

function Required() {
	return <span>(champ obligatoire)</span>;
}

function Optional() {
	return <span>(champ optionnel)</span>;
}

Label.Complement = Complement;
Label.Required = Required;
Label.Optional = Optional;


