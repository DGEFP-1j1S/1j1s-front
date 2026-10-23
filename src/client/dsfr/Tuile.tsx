import classNames from "classnames";
import React from "react";

import { HtmlHeadingTag } from "~/client/components/props";
import { Link } from "~/client/components/ui/Link/Link";
import { useIsInternalLink } from "~/client/hooks/useIsInternalLink";

interface TuileProps {
	titre: React.ReactNode
	lien: string
	titreAs?: HtmlHeadingTag
	className?: string
}

export function Tuile({
	children,
	titre,
	lien,
	titreAs = "h3",
	className,
}: React.PropsWithChildren<TuileProps>) {
	const isInternalLink = useIsInternalLink(lien);
	const title = !isInternalLink && typeof titre === "string" ? `${titre} - nouvelle fenêtre` : undefined;

	return (
		<div className={classNames("fr-tile", "fr-enlarge-link", className)}>
			<div className="fr-tile__body">
				<div className="fr-tile__content">
					{React.createElement(
						titreAs,
						{ className: "fr-tile__title" },
						<Link href={lien} title={title}>{titre}</Link>,
					)}
					{children && <p className="fr-tile__desc">{children}</p>}
				</div>
			</div>
		</div>
	);
}
