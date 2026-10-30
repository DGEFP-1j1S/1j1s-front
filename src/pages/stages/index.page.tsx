import Joi from 'joi';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import React from 'react';

import { RechercherOffreStage } from '~/client/components/features/OffreDeStage/Rechercher/RechercherOffreStage';
import { Head } from '~/client/components/head/Head';
import useAnalytics from '~/client/hooks/useAnalytics';
import { transformQueryToArray } from '~/pages/api/utils/joi/joi.util';
import { queryToValeurs } from '~/pages/api/utils/queryToArray.util';
import analytics from '~/pages/stages/index.analytics';
import { isFailure } from '~/server/errors/either';
import { Erreur } from '~/server/errors/erreur.types';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { changeStatusCodeWhenErrorOcurred } from '~/server/errors/handleGetServerSidePropsError';
import { FiltreRechercheOffreStage, ResultatsRechercheOffreStage } from '~/server/stages/domain/rechercheOffreStage';
import { dependencies } from '~/server/start';

interface RechercherOffreStagePageProps {
	erreurRecherche?: Erreur
	resultats?: ResultatsRechercheOffreStage
}

export default function RechercherOffreStagePage(props: RechercherOffreStagePageProps) {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title={'Rechercher un stage | 1jeune1solution'}
				description="Des milliers d‘offres de stages sélectionnées pour vous"
				robots="index,follow" />
			<RechercherOffreStage resultats={props.resultats} erreurRecherche={props.erreurRecherche} />
		</>
	);
}

const LONGUEUR_MAXIMUM_DES_VALEURS = 200;
const listeDeValeurs = transformQueryToArray.array().items(Joi.string().max(LONGUEUR_MAXIMUM_DES_VALEURS));

const stagesQuerySchema = Joi.object({
	domaines: listeDeValeurs,
	durees: listeDeValeurs,
	localisations: listeDeValeurs,
	motCle: Joi.string().max(LONGUEUR_MAXIMUM_DES_VALEURS),
	page: Joi.number().integer().min(1),
}).options({ allowUnknown: true });

type RequestQuery = Partial<{ [p: string]: string | string[] }>;

function stagesFiltreMapper(query: RequestQuery): FiltreRechercheOffreStage {
	return {
		domaines: query.domaines ? queryToValeurs(query.domaines) : [],
		durees: query.durees ? queryToValeurs(query.durees) : [],
		localisations: query.localisations ? queryToValeurs(query.localisations) : [],
		motCle: query.motCle ? String(query.motCle) : undefined,
		page: query.page ? Number(query.page) : 1,
	};
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<RechercherOffreStagePageProps>> {
	if (stagesQuerySchema.validate(context.query).error) {
		changeStatusCodeWhenErrorOcurred(context, ErreurMetier.DEMANDE_INCORRECTE);
		return { props: { erreurRecherche: ErreurMetier.DEMANDE_INCORRECTE } };
	}

	const resultatsRecherche = await dependencies.stagesDependencies.rechercherOffreStage.handle(stagesFiltreMapper(context.query));

	if (isFailure(resultatsRecherche)) {
		changeStatusCodeWhenErrorOcurred(context, resultatsRecherche.errorType);
		return { props: { erreurRecherche: resultatsRecherche.errorType } };
	}

	return { props: { resultats: JSON.parse(JSON.stringify(resultatsRecherche.result)) } };
}
