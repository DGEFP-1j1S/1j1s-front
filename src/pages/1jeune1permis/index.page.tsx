import { GetServerSidePropsResult } from "next";
import React from "react";

import { Head } from "~/client/components/head/Head";
import { HeroWithButtonLink } from "~/client/components/ui/Hero/HeroWithButtonLink";
import useAnalytics from "~/client/hooks/useAnalytics";

import analyticsPageConfig from "./index.analytics";

const URL_1JEUNE_1PERMIS = "https://mes-aides.francetravail.fr/export/1-jeune-1-permis";

export async function getStaticProps(): Promise<GetServerSidePropsResult<Record<never, never>>> {
	const isFeatureActive = process.env.NEXT_PUBLIC_1JEUNE1PERMIS_FEATURE === "1";

	if (!isFeatureActive) return { notFound: true };

	return {
		props: {},
	};
}

export default function UnJeuneUnPermis() {
	useAnalytics(analyticsPageConfig);

	return (
		<main id="contenu">
			<Head
				title="1jeune1permis | 1jeune1solution"
				robots="index,follow" />
			<HeroWithButtonLink
				title="Aides au permis de conduire"
				content={
					<span className="fr-text--bold">
						{"Découvrez 1 jeune 1 permis, le service officiel en partenariat avec Mes aides France Travail pour trouver chaque aide au permis de conduire adaptée à votre profil."}
					</span>
				}
				description={"1 jeune 1 permis facilite l’accès aux aides financières pour passer le permis de conduire (permis B). Le service permet d’identifier les dispositifs disponibles selon la localisation. Il rassemble les informations essentielles pour comprendre les démarches. Des conseils pratiques accompagnent la préparation du code et de la conduite.\nUne solution simple pour faciliter la mobilité et l’accès à l’emploi."}
				buttonLabel="Découvrir les aides au permis"
				buttonHref={URL_1JEUNE_1PERMIS}
				imgSrc="/images/1jeune1permis-aides.webp"
				imgAlt="1Jeune1Permis tout ce qu’il faut savoir pour passer le permis de conduire"
				imgContain />
		</main>
	);
}
