import classNames from "classnames";
import React, { useEffect, useId, useRef } from "react";

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
	const titleRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const button = titleRef.current?.querySelector("button");

		if (!button) return;

		const observer = new MutationObserver(() => {
			if (button.getAttribute("aria-expanded") === "true") {
				requestAnimationFrame(() => {
					titleRef.current?.scrollIntoView({
						behavior: "smooth",
						block: "start",
					});
				});
			}
		});

		observer.observe(button, {
			attributes: true,
			attributeFilter: ["aria-expanded"],
		});

		return () => observer.disconnect();
	}, []);

	return (
		<section className={classNames("fr-accordion", className)}>
			{React.createElement(
				titreAs,
				{ className: "fr-accordion__title	", ref: titleRef },
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
