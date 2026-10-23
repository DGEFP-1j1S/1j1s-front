import classNames from 'classnames';
import React, { ComponentPropsWithoutRef } from 'react';

type LabelProps = ComponentPropsWithoutRef<'label'> & {
	label?: string
}

export function Label({ className, children, ...rest }: LabelProps) {
	return (
		<label className={classNames('fr-label', className)} {...rest}>
			{children}
		</label>
	);
}

type ComplementProps = ComponentPropsWithoutRef<'small'>

function Complement({ className, ...props }: ComplementProps) {
	return <small className={classNames('fr-hint-text', className)} {...props} />;
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
