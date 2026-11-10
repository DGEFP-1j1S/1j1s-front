import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { useMemo } from 'react';

import { ConsulterAnnonce } from '~/client/components/features/Logement/Consulter/ConsulterAnnonce';
import { Head } from '~/client/components/head/Head';
import ErrorUnavailableService from '~/client/components/layouts/Error/ErrorUnavailableService';
import useAnalytics from '~/client/hooks/useAnalytics';
import { usePopstate } from '~/client/hooks/usePopstate';
import analytics from '~/pages/logements/annonces/[id].analytics';
import { GetServerSidePropsResult } from '~/server/errors/getServerSidePropsResultWithError';
import { handleGetServerSidePropsError } from '~/server/errors/handleGetServerSidePropsError';
import { PageContextParamsException } from '~/server/exceptions/pageContextParams.exception';
import { AnnonceDeLogement } from '~/server/logements/domain/annonceDeLogement';
import { dependencies } from '~/server/start';

export default function ConsulterAnnonceLogementPage({ annonceDeLogement, isFeatureActive }: ConsulterAnnonceLogementPageProps) {
	useAnalytics(analytics);
	usePopstate();

	const annonce = useMemo(() => ({
    ...annonceDeLogement,
    dateDeMiseAJour: new Date(annonceDeLogement.dateDeMiseAJour),
    dateDeDisponibilite: new Date(annonceDeLogement.dateDeDisponibilite)
  }), [annonceDeLogement]);

	if (!isFeatureActive) return <ErrorUnavailableService />;

	return (
		<>
			<Head
				title={`${annonce.titre} | 1jeune1solution`}
				robots="noindex" />
			<main id="contenu">
				<ConsulterAnnonce annonceDeLogement={annonce} />
			</main>
		</>
	);
}

interface LogementContext extends ParsedUrlQuery {
	id: string;
}

type ConsulterAnnonceLogementPageProps = {
	annonceDeLogement: AnnonceDeLogement;
	isFeatureActive: true
} | {
	annonceDeLogement?: never;
	isFeatureActive: false
}

export async function getServerSideProps(context: GetServerSidePropsContext<LogementContext>): Promise<GetServerSidePropsResult<ConsulterAnnonceLogementPageProps>> {
	const displayAnnoncesLogement = process.env.NEXT_PUBLIC_LOGEMENT_FEATURE === '1';
	if (!displayAnnoncesLogement) return {
		props: {
			isFeatureActive: false,
		},
	};

	if (!context.params) {
		throw new PageContextParamsException();
	}
	const { id: slug } = context.params;

	const annonceDeLogement = await dependencies.annonceDeLogementDependencies.consulterAnnonceLogementUseCase.handle(slug);
	if (annonceDeLogement.instance === 'failure') {
		return handleGetServerSidePropsError(context, annonceDeLogement.errorType);
	}

	return {
		props: {
			annonceDeLogement: JSON.parse(JSON.stringify(annonceDeLogement.result)),
			isFeatureActive: true,
		},
	};
}
