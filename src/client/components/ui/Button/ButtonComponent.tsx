import classNames from 'classnames';
import React, { useMemo } from 'react';

import styles from './button-component.module.scss';

type ButtonAppearance = 'primary' | 'secondary' | 'tertiary' | 'quaternary';

type IconPosition = 'top' | 'left' | 'right';

type IconProps = {
	icon: React.ReactNode;
	iconPosition: IconPosition;
} | {
	icon?: never;
	iconPosition?: never;
}

export type ButtonComponentProps = React.ComponentPropsWithoutRef<'button'> & {
	appearance?: ButtonAppearance
	label: React.ReactNode
}

type ButtonComponentPropsWithIconProps = ButtonComponentProps & IconProps

export const ButtonComponent = React.forwardRef<HTMLButtonElement, ButtonComponentPropsWithIconProps>(function ButtonComponent(
	{ appearance = 'primary', className, icon, iconPosition, label, ...rest },
	ref) {
	const appearanceClass = useMemo(() => {
		switch (appearance) {
			case 'primary':
				return styles.buttonPrimary;
			case 'secondary':
				return styles.buttonSecondary;
			case 'tertiary':
				return styles.buttonTertiary;
			case 'quaternary':
				return styles.buttonQuaternary;
		}
	}, [appearance]);

	const iconPositionClass = useMemo(() => {
		switch (iconPosition) {
			case 'top':
				return styles.buttonWithTopIcon;
			case 'left':
				return styles.buttonWithLeftIcon;
			case 'right':
				return styles.buttonWithRightIcon;
		}
	}, [iconPosition]);

	const buttonStyles = useMemo(() => classNames(className, styles.button, appearanceClass, iconPositionClass),
		[appearanceClass, className, iconPositionClass]);

	const buttonBody = useMemo(() => {
		switch (iconPosition) {
			case 'top':
			case 'left':
				return (<>{icon}<span className={styles.buttonLabel}>{label}</span></>);
			case 'right':
				return (<><span className={styles.buttonLabel}>{label}</span>{icon}</>);
			default:
				return (<span className={styles.buttonLabel}>{label}</span>);
		}
	}, [icon, iconPosition, label]);

	return (
		<button className={buttonStyles} ref={ref} {...rest}>
			{buttonBody}
		</button>
	);
});
