import classNames from "classnames";
import Image, { StaticImageData } from "next/image";
import React from "react";

import { HtmlHeadingTag } from "~/client/components/props";
import { Link } from "~/client/components/ui/Link/Link";
import { useIsInternalLink } from "~/client/hooks/useIsInternalLink";

interface TuileProps {
	titre: React.ReactNode
	lien: string
	titreAs?: HtmlHeadingTag
	className?: string
	telechargement?: string
	pictogramme?: StaticImageData
}

export function Tuile({
	children,
	titre,
	lien,
	titreAs = "h3",
	className,
	telechargement,
	pictogramme,
}: React.PropsWithChildren<TuileProps>) {
	const isInternalLink = useIsInternalLink(lien);
	const suffixe = telechargement ?? (!isInternalLink ? "nouvelle fenêtre" : undefined);
	const title = suffixe && typeof titre === "string" ? `${titre} - ${suffixe}` : undefined;

	return (
		<div className={classNames("fr-tile", "fr-enlarge-link", { "fr-tile--download": telechargement }, className)}>
			<div className="fr-tile__body">
				<div className="fr-tile__content">
					{React.createElement(
						titreAs,
						{ className: "fr-tile__title" },
						<Link href={lien} title={title} download={telechargement ? true : undefined}>{titre}</Link>,
					)}
					{children && <p className="fr-tile__desc">{children}</p>}
					{telechargement && <p className="fr-tile__detail">{telechargement}</p>}
				</div>
			</div>
			{pictogramme && (
				<div className="fr-tile__header">
					<div className="fr-tile__pictogram">
						<Image src={pictogramme} alt="" width={80} height={80} />
					</div>
				</div>
			)}
		</div>
	);
}
