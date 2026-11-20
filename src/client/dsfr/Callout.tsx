import React from 'react';
import { Link } from "~/client/components/ui/Link/Link";
import classNames from "classnames";

type AccentColor = "green-tilleul-verveine" | "green-bourgeon" | "green-emeraude" | "green-menthe" | "green-archipel" | 
	"blue-ecume" | "blue-cumulus" | "purple-glycine" | "pink-macaron" | "pink-tuile" | "yellow-tournesol" | 
	"yellow-moutarde" | "orange-terre-battue" | "brown-cafe-creme" | "brown-caramel" | "brown-opera" | "beige-gris-galet"

interface CalloutProps {
	accent?: AccentColor
	title: string;
	titleAs?: string;
	text: string;
	link?: { href: string; text: string };
	isSmall?: boolean;
	children?: React.ReactNode;
}

export function Callout({ accent, title, titleAs = "h3", text, link, isSmall = false, children, ...rest }: CalloutProps & React.ComponentPropsWithoutRef<'div'>) {
	const accentClassName = accent ? "fr-callout--" + accent : ""
	const titleClassName = `fr-callout__title${isSmall ? " fr-text--lead" : ""}`
	const textClassName = classNames("fr-callout__text", ((link || children) ? "fr-mb-4w" : ""), (isSmall && "fr-text--md"))

	return (
		<div className={classNames("fr-callout", accentClassName, rest.className)}>
			{React.createElement(titleAs, { className: titleClassName }, title)}
			<p className={textClassName}>{text}</p>
			{children && children}
			{link && (<Link className="fr-link" href={link.href}>{link.text}</Link>)}
		</div>
	);
}
