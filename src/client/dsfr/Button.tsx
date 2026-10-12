import classNames from 'classnames';
import React, { useMemo } from 'react';

type ButtonAppearance = 'primary' | 'secondary' | 'tertiary' | 'tertiary-no-outline';

type IconPosition = 'top' | 'left' | 'right';

type IconProps = {
	icon?: React.ReactNode;
	iconPosition: IconPosition;
} | {
	icon?: never;
	iconPosition?: never;
}

export type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
	appearance?: ButtonAppearance;
	label: React.ReactNode;
}

type ButtonPropsWithIcon = ButtonProps & IconProps;

export const Button = React.forwardRef<HTMLButtonElement, ButtonPropsWithIcon>(function Button(
	{ appearance = 'primary', className, icon, iconPosition, label, ...rest },
	ref) {

	const appearanceClass = useMemo(() => {
		switch (appearance) {
			case 'primary':
				return undefined;
			case 'secondary':
				return 'fr-btn--secondary';
			case 'tertiary':
				return 'fr-btn--tertiary';
			case 'tertiary-no-outline':
				return 'fr-btn--tertiary-no-outline';
		}
	}, [appearance]);

	const iconClass = useMemo(() => {
		switch (iconPosition) {
			case 'left':
				return 'fr-btn--icon-left';
			case 'right':
				return 'fr-btn--icon-right';
			default:
				return undefined;
		}
	}, [iconPosition]);

	const buttonBody = useMemo(() => {
		switch (iconPosition) {
			case 'top':
			case 'left':
				return (<>{icon}{label}</>);
			case 'right':
				return (<>{label}{icon}</>);
			default:
				return label;
		}
	}, [icon, iconPosition, label]);

	return (
		<button
			className={classNames('fr-btn', appearanceClass, iconClass, className)}
			ref={ref}
			{...rest}>
			{buttonBody}
		</button>
	);
});
