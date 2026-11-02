import React from "react";
import { Carte } from "../../../dsfr";

export function CeQueTuPourrasFaireSurLApp() {
	return (
		<section className="fr-container fr-py-10w">
			<h2>Ce que tu pourras faire sur l’application</h2>
			<p className="fr-text--lg fr-mb-5w">5 fonctionnalités pensées avec les jeunes et les conseillers</p>
			<ul className="fr-grid-row fr-grid-row--gutters">
				{ cartesAppMobile.map(carte =>
					(<li key={carte.titre} className="fr-col-lg-4 fr-col-md-6 fr-col-12">
						<Carte
							titre={carte.titre}
							tags={carte.tags}
							pictogramme={carte.imageSrc}
						>
							{carte.description}
						</Carte>
					</li>)
				)}
			</ul>
		</section>
	);
}

type CarteAppMobile	= {
	titre: string,
	description: string
	tags: string[],
	imageSrc: string
}

const cartesAppMobile: CarteAppMobile[] = [
	{
		titre: "Explorer des pistes d’actions personnalisées",
		description: "Reçois des suggestions d'actions à réaliser, adaptées à ton projet. \n" +
			"Coche les actions au fur et à mesure de ton avancement, et supprime celles qui ne t'intéressent pas. \n" +
			" Recherche de solution",
		tags: ["Mes pistes à explorer"],
		imageSrc: "/images/dsfr/environment.svg"
	},
	{
		titre: "Rechercher des offres d’emploi, d’alternance, d’immersion et de service civique",
		description: "Emploi, alternance, immersion, service civique et formation : explore par type d'offre, \n" +
			"garde ta recherche en mémoire, suis les offres auxquelles tu as postulé et crée des alertes. Événements",
		tags: ["Mes recherches de solution"],
		imageSrc: "/images/dsfr/search.svg"
	},
	{
		titre: "Rechercher des événements",
		description: "Ateliers, réunions d'information et job datings : la date, le lieu et le nombre de places restantes s'affichent avant l'inscription. Agenda",
		tags: ["Mes événements"],
		imageSrc: "/images/dsfr/location-france.svg"
	},
	{
		titre: "Saisir tes démarches et tes rendez-vous",
		description: "Construis ta liste d'actions à réaliser et ne rate plus aucun rendez-vous grâce aux rappels \n" +
			"une semaine avant et la veille de l'entretien. Tes démarches saisies au fil de l'eau enrichissent ton dossier \n" +
			"et servent de base d'échange avec ton conseiller. Chat",
		tags: ["Mes démarches"],
		imageSrc: "/images/dsfr/conclusion.svg"
	},
	{
		titre: "Communiquer avec ton conseiller référent sur une messagerie instantanée ",
		description: "Échange de manière instantanée avec ton conseiller référent et sois informé lorsque ton message a été lu.",
		tags: ["Mes échanges"],
		imageSrc: "/images/dsfr/community.svg"
	}
]
