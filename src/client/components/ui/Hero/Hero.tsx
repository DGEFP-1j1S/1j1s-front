import classNames from 'classnames';
import React from 'react';

import styles from '~/client/components/ui/Hero/Hero.module.scss';
import { Image } from '~/client/components/ui/Img';

interface HeroIllustrationProps extends React.ComponentPropsWithoutRef<'div'> {
	image: string
}

export function Hero({ children, className, ...rest }: React.ComponentPropsWithoutRef<'div'>) {
	return (
		<div className={classNames(styles.hero, className)} {...rest}>
			<div className={styles.heroTextWrapper}>
				{ children }
			</div>
		</div>
	);
}

export function HeroWithIllustration({ children, className, image, ...rest }: HeroIllustrationProps) {
	return (
		<div className={classNames(styles.hero, className)} {...rest}>
			<div className={styles.heroTextWrapper}>
				{children}
			</div>
			<div className={styles.heroIllustration}>
				<Image src={image} alt="" fill sizes="(min-width: 992px) 50vw" />
			</div>
		</div>
	);
}

export function HeroPrimaryText({ children, className, ...rest }: React.ComponentPropsWithoutRef<'span'>) {
	return (
		<span className={classNames(styles.heroPrimaryText, className)} {...rest}>
			{children}
		</span>
	);
}

export function HeroSecondaryText({ children, className, ...rest }: React.ComponentPropsWithoutRef<'p'>) {
	return (
		<p className={classNames(styles.heroSecondaryText, className)} {...rest}>
			{children}
		</p>
	);
}
