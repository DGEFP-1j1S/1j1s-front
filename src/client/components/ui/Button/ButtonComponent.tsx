import React, { useMemo } from 'react';

type IconPosition = 'top' | 'left' | 'right';

type IconProps = {
	icon: React.ReactNode;
	iconPosition: IconPosition;
} | {
	icon?: never;
	iconPosition?: never;
}

export type ButtonComponentProps = React.ComponentPropsWithoutRef<'button'> & {
	label: React.ReactNode
}

type ButtonComponentPropsWithIconProps = ButtonComponentProps & IconProps

export const ButtonComponent = React.forwardRef<HTMLButtonElement, ButtonComponentPropsWithIconProps>(function ButtonComponent(
	{ icon, iconPosition, label, ...rest },
	ref) {

	const buttonBody = useMemo(() => {
		switch (iconPosition) {
			case 'top':
			case 'left':
				return (<>{icon}<span>{label}</span></>);
			case 'right':
				return (<><span>{label}</span>{icon}</>);
			default:
				return (<span>{label}</span>);
		}
	}, [icon, iconPosition, label]);

	return (
		<button className="fr-btn" ref={ref} {...rest}>
			{buttonBody}
		</button>
	);
});
