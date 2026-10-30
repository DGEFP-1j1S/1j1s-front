import Joi from 'joi';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import React from 'react';

import { RechercherFicheMetier } from '~/client/components/features/FicheMetier/Rechercher/RechercherFicheMetier';
import { ServiceCardList } from '~/client/components/features/ServiceCard/Card/ServiceCard';
import { MetierDuSoinPartner } from '~/client/components/features/ServiceCard/MetiersDuSoinPartner';
import { Head } from '~/client/components/head/Head';
import useAnalytics from '~/client/hooks/useAnalytics';
import { transformQueryToArray } from '~/pages/api/utils/joi/joi.util';
import { queryToValeurs } from '~/pages/api/utils/queryToArray.util';
import analytics from '~/pages/decouvrir-les-metiers/index.analytics';
import { isFailure } from '~/server/errors/either';
import { Erreur } from '~/server/errors/erreur.types';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { changeStatusCodeWhenErrorOcurred } from '~/server/errors/handleGetServerSidePropsError';
import { FiltreRechercheFicheMetier, ResultatsRechercheFicheMetier } from '~/server/fiche-metier/domain/rechercheFicheMetier';
import { dependencies } from '~/server/start';

interface RechercherFicheMetierPageProps {
	erreurRecherche?: Erreur
	resultats?: ResultatsRechercheFicheMetier
}

export default function RechercherFicheMetierPage(props: RechercherFicheMetierPageProps) {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title={'Rechercher un métier | 1jeune1solution'}
				description="Trouver le métier qui vous correspond"
				robots="index,follow" />
			<RechercherFicheMetier resultats={props.resultats} erreurRecherche={props.erreurRecherche} />
			<ServiceCardList>
				<MetierDuSoinPartner />
			</ServiceCardList>
		</>
	);
}

const LONGUEUR_MAXIMUM_DES_VALEURS = 200;

const ficheMetierQuerySchema = Joi.object({
	centresInteret: transformQueryToArray.array().items(Joi.string().max(LONGUEUR_MAXIMUM_DES_VALEURS)),
	motCle: Joi.string().max(LONGUEUR_MAXIMUM_DES_VALEURS),
	page: Joi.number().integer().min(1),
}).options({ allowUnknown: true });

type RequestQuery = Partial<{ [p: string]: string | string[] }>;

function ficheMetierFiltreMapper(query: RequestQuery): FiltreRechercheFicheMetier {
	return {
		centresInteret: query.centresInteret ? queryToValeurs(query.centresInteret) : [],
		motCle: query.motCle ? String(query.motCle) : undefined,
		page: query.page ? Number(query.page) : 1,
	};
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<RechercherFicheMetierPageProps>> {
	if (ficheMetierQuerySchema.validate(context.query).error) {
		changeStatusCodeWhenErrorOcurred(context, ErreurMetier.DEMANDE_INCORRECTE);
		return { props: { erreurRecherche: ErreurMetier.DEMANDE_INCORRECTE } };
	}

	const resultatsRecherche = await dependencies.ficheMetierDependencies.rechercherFicheMetier.handle(ficheMetierFiltreMapper(context.query));

	if (isFailure(resultatsRecherche)) {
		changeStatusCodeWhenErrorOcurred(context, resultatsRecherche.errorType);
		return { props: { erreurRecherche: resultatsRecherche.errorType } };
	}

	return { props: { resultats: JSON.parse(JSON.stringify(resultatsRecherche.result)) } };
}
