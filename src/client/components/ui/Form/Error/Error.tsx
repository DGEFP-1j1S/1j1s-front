import classNames from 'classnames';
import { ComponentPropsWithoutRef } from 'react';

type ErrorProps = ComponentPropsWithoutRef<'p'>

export function Error({ className, ...rest }: ErrorProps) {
	return <div className="fr-messages-group" aria-live="polite" {...rest}>
		<p className={classNames('fr-message fr-message--error', className)} {...rest} />
	</div>;
}
