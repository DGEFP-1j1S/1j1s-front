import classNames from 'classnames';
import React from 'react';

import styles from '~/client/components/ui/Hero/Hero.module.scss';
import { Image } from '~/client/components/ui/Img';
import useBreakpoint from "~/client/hooks/useBreakpoint";

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

export function Banner({ children, ...rest }: React.ComponentPropsWithoutRef<'div'>) {
	return (
		<div className="fr-container fr-py-5w">
			<div className="fr-grid-row fr-grid-row-gutters align-items--center" {...rest}>
				<div className="fr-col-lg-7 fr-col-12">
					{children}
				</div>
			</div>
		</div>
	);
}

interface BannerIllustrationProps extends HeroIllustrationProps {
	isCover?: boolean
}

export function BannerWithIllustration({ children, image, isCover = false, ...rest }: BannerIllustrationProps) {
	const { isLargeScreen } = useBreakpoint();
	const containerClassName = isLargeScreen ? "fr-container" : "fr-container fr-py-5w"
	return (
		<div className={containerClassName}>
			<div className="fr-grid-row fr-grid-row-gutters align-items--center" {...rest}>
				<div className="fr-col-lg-6 fr-col-12">
					{children}
				</div>
				<div className="fr-col-lg-6 fr-col-12 fr-hidden fr-unhidden-lg">
					<Image className={isCover ? "img-cover" : "img-contain"} src={image} alt="" width="400" height="300" sizes="(min-width: 992px) 50vw" />
				</div>
			</div>
		</div>
	);
}
