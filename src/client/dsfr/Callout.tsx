import React from 'react';
import { Link } from "~/client/components/ui/Link/Link";
import classNames from "classnames";

type AccentColor = "green-tilleul-verveine" | "green-bourgeon" | "green-emeraude" | "green-menthe" | "green-archipel" | 
	"blue-ecume" | "blue-cumulus" | "purple-glycine" | "pink-macaron" | "pink-tuile" | "yellow-tournesol" | 
	"yellow-moutarde" | "orange-terre-battue" | "brown-cafe-creme" | "brown-caramel" | "brown-opera" | "beige-gris-galet"

interface CalloutProps {
	accent?: AccentColor
	title: string;
	text: string;
	link?: { href: string; text: string };
	children?: React.ReactNode;
}

export function Callout({ accent, title, text, link, children, ...rest }: CalloutProps & React.ComponentPropsWithoutRef<'div'>) {
	const accentClassName = accent ? "fr-callout--" + accent : ""

	return (
		<div className={classNames("fr-callout", accentClassName, rest.className)}>
			<h3 className="fr-callout__title">{title}</h3>
			<p className="fr-callout__text fr-mb-4w">{text}</p>
			{children && children}
			{link && (<Link className="fr-link" href={link.href}>{link.text}</Link>)}
		</div>
	);
}
