import classNames from "classnames";
import React, { useId } from "react";

import { HtmlHeadingTag } from "~/client/components/props";

interface AccordionProps {
	titre: React.ReactNode
	titreAs?: HtmlHeadingTag
	className?: string
	expanded?: boolean
}

export function Accordion({
	children,
	titre,
	titreAs = "h3",
	className,
	expanded = false,
}: React.PropsWithChildren<AccordionProps>) {
	const collapseId = `accordion-${useId().replace(/:/g, "")}`;

	return (
		<section className={classNames("fr-accordion", className)}>
			{React.createElement(
				titreAs,
				{ className: "fr-accordion__title" },
				<button type="button" className="fr-accordion__btn" aria-expanded={expanded} aria-controls={collapseId}>
					{titre}
				</button>,
			)}
			<div className="fr-collapse" id={collapseId}>
				{children}
			</div>
		</section>
	);
}
