import { GetServerSidePropsContext } from 'next';
import { useMemo } from 'react';

import { ConsulterAnnonce } from '~/client/components/features/Logement/Consulter/ConsulterAnnonce';
import { Head } from '~/client/components/head/Head';
import ErrorUnavailableService from '~/client/components/layouts/Error/ErrorUnavailableService';
import useAnalytics from '~/client/hooks/useAnalytics';
import { usePopstate } from '~/client/hooks/usePopstate';
import analytics from '~/pages/logements/annonces/[id].analytics';
import { AnnonceDeLogementContext, chargerAnnonceDeLogement } from "~/pages/logements/annonces/chargerAnnonceDeLogement";
import { GetServerSidePropsResult } from '~/server/errors/getServerSidePropsResultWithError';
import { AnnonceDeLogement } from '~/server/logements/domain/annonceDeLogement';

export default function ConsulterAnnonceLogementPage({ annonceDeLogement, slug, isFeatureActive }: ConsulterAnnonceLogementPageProps) {
	useAnalytics(analytics);
	usePopstate();

	const annonce = useMemo(() => ({
    ...annonceDeLogement,
    dateDeMiseAJour: new Date(annonceDeLogement.dateDeMiseAJour),
    dateDeDisponibilité: new Date(annonceDeLogement.dateDeDisponibilité)
  }), [annonceDeLogement]);

	if (!isFeatureActive) return <ErrorUnavailableService />;

	return (
		<>
			<Head
				title={`${annonce.titre} | 1jeune1solution`}
				robots="noindex"
			/>
			<main id="contenu">
				<ConsulterAnnonce annonceDeLogement={annonce} slug={slug} />
			</main>
		</>
	);
}

type ConsulterAnnonceLogementPageProps = {
	annonceDeLogement: AnnonceDeLogement;
	slug: string;
	isFeatureActive: true
} | {
	annonceDeLogement?: never;
	slug?: never;
	isFeatureActive: false
}

export async function getServerSideProps(context: GetServerSidePropsContext<AnnonceDeLogementContext>): Promise<GetServerSidePropsResult<ConsulterAnnonceLogementPageProps>> {
	return chargerAnnonceDeLogement(context, (annonceDeLogement, slug) => ({
		annonceDeLogement: JSON.parse(JSON.stringify(annonceDeLogement)),
		slug,
	}));
}
