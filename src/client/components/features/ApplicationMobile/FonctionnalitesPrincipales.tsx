import React from "react";
import { Image } from "~/client/components/ui/Img";

export function FonctionnalitesPrincipales() {
	return (
		<section className="fr-container fr-p-4w fr-p-md-10w background--blue-light">
			<h2>Les principales fonctionnalités de l&#39;application</h2>
			<ul className="fr-grid-row fr-grid-row--gutters">
				{ fonctionnalitesAppMobile.map(fonc => (
					<li key={fonc.imageSrc} className="fr-col-lg-3 fr-col-md-6 fr-col-12">
						<Image
							src={fonc.imageSrc}
							alt={fonc.imageAlt}
							width="258"
							height="504"
						/>
						<p className="fr-text--md fr-text--bold fr-mb-0">
							{fonc.description}
						</p>
					</li>
				))}
			</ul>
		</section>
	);
}

type FonctionnaliteAppMobile	= {
	description: string
	imageSrc: string
	imageAlt: string
}

const fonctionnalitesAppMobile: FonctionnaliteAppMobile[] = [
	{
		description: "Des pistes d’actions personnalisées",
		imageSrc: "/images/application-mobile/screen-app-pistes.png",
		imageAlt: `Écran "Mes pistes à explorer" de l'application mobile 1jeune1solution : liste de suggestions proposées dans l'espace connecté`
	},
	{
		description: "La recherche d’offres d’emploi, d’alternance, d’immersion et de service civique",
		imageSrc: "/images/application-mobile/screen-app-offres.png",
		imageAlt: `Écran "Offres" de l'application mobile 1jeune1solution : emploi, alternance, immersion, service civique`
	},
	{
		description: "La recherche d’évènements",
		imageSrc: "/images/application-mobile/screen-app-evenements.png",
		imageAlt: `Écran "Agenda" de l'application mobile 1jeune1solution`,
	},
	{
		description: "Une messagerie instantanée avec mon conseiller référent",
		imageSrc: "/images/application-mobile/screen-app-messagerie.png",
		imageAlt: `Écran "Messagerie" de l'application mobile 1jeune1solution : échange avec son conseiller ou sa mission locale`,
	}
]
