import classNames from 'classnames';
import LinkNext from 'next/link';
import React, {
	createContext,
	Dispatch,
	PropsWithChildren,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from 'react';

import { Icon, IconName, IconProps } from '~/client/components/ui/Icon/Icon';
import NoProviderError from '~/client/Errors/NoProviderError';
import { useIsInternalLink } from '~/client/hooks/useIsInternalLink';
import { anchorRegex } from '~/shared/anchorRegex';

import styles from './Link.module.scss';

export type ButtonAppearance = 'asPrimaryButton' | 'asSecondaryButton' | 'asTertiaryButton' | 'asQuaternaryButton';


interface Link extends React.ComponentPropsWithoutRef<'a'> {
	href: string
	appearance?: ButtonAppearance
	prefetch?: boolean
}

interface LinkContext {
	setIsLinkIcon: Dispatch<SetStateAction<boolean>>,
	href: string
}

const LinkContext = createContext<LinkContext | null>(null);

const useLinkContext = () => {
	const linkContext = useContext(LinkContext);
	if (linkContext === null) {
		throw new NoProviderError(LinkContext);
	}
	return linkContext;
};

export function Link(props: PropsWithChildren<Link>) {
	const {
		className,
		appearance,
		children,
		href,
		prefetch = false,
		...rest
	} = props;
	const [isLinkIcon, setIsLinkIcon] = useState<boolean>(false);
	const isInternalLink = useIsInternalLink(href);
	const isAnAnchor = isInternalLink && new RegExp(anchorRegex).test(href);

	const appearanceClasses: Record<ButtonAppearance, string> = {
		asPrimaryButton: styles.primary,
		asQuaternaryButton: styles.quaternary,
		asSecondaryButton: styles.secondary,
		asTertiaryButton: styles.tertiary,
	};

	const appearanceClass = appearance ? appearanceClasses[appearance] : '';

	const commonProps = {
		className: classNames(className, appearanceClass, isLinkIcon && styles.linkWithIcon),
		...rest,
	};

	return (
		<LinkContext.Provider value={{ href, setIsLinkIcon }}>
			{/* NOTE (SYMO 26/06/2024): Nous avons opté pour l'élément HTML <a> pour créer des ancres, car l'utilisation de <LinkNext> provoque un bug de focus sur les éléments suivants, probablement parce que ce composant est conçu pour la navigation entre routes. */}
			{isAnAnchor ? ( 
				<a href={href} {...commonProps}>{children}</a>
			) : isInternalLink ? (
				<LinkNext href={href} prefetch={prefetch} {...commonProps}>{children}</LinkNext>
			) : (
				<a href={href} target="_blank" rel="noreferrer" {...commonProps}>{children}</a>
			)}
		</LinkContext.Provider>
	);
}
interface LinkIconProps extends Omit<IconProps, 'name'> {
	name?: IconName
	className?: string
}

export function LinkIcon(props: LinkIconProps) {
	const {
		name,
		className,
		...rest
	} = props;
	const { setIsLinkIcon } = useLinkContext();

	useEffect(() => {
		setIsLinkIcon(true);
	}, [setIsLinkIcon]);

	return (
		<span className={styles.icon}>
			{name ? <Icon className={className} name={name} {...rest} /> : <DefaultLinkIcon className={className} {...rest} />}
		</span>
	);
}


interface DefaultLinkIconProps extends Omit<IconProps, 'name'> {
	className?: string
}

function DefaultLinkIcon({ className, ...rest }: DefaultLinkIconProps) {
	const { href } = useLinkContext();
	const isInternalLink = useIsInternalLink(href);

	return (
		<>{isInternalLink ? <Icon name="arrow-right" className={className} {...rest} /> :
			<Icon className={className} name="external-redirection" aria-hidden="false" aria-label="- nouvelle fenêtre" {...rest} />}</>
	);
}

Link.Icon = LinkIcon;

