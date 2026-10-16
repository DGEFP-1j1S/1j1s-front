import Joi from 'joi';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import { stringify } from 'querystring';
import React, { useEffect } from 'react';

import { RechercherOffreEmploi } from '~/client/components/features/OffreEmploi/Rechercher/RechercherOffreEmploi';
import useAnalytics from '~/client/hooks/useAnalytics';
import empty from '~/client/utils/empty';
import { transformQueryToArray } from '~/pages/api/utils/joi/joi.util';
import { queryToArray } from '~/pages/api/utils/queryToArray.util';
import analytics from '~/pages/emplois/index.analytics';
import { EmploiFiltre } from '~/server/emplois/domain/emploi';
import {
	LONGUEUR_MINIMUM_DU_MOT_CLE_REQUISE_PAR_FRANCE_TRAVAIL,
} from '~/server/emplois/infra/repositories/apiFranceTravailOffre.repository';
import { isFailure } from '~/server/errors/either';
import { Erreur } from '~/server/errors/erreur.types';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { changeStatusCodeWhenErrorOcurred } from '~/server/errors/handleGetServerSidePropsError';
import { DomaineCode, MAX_PAGE_ALLOWED_BY_FRANCE_TRAVAIL, RésultatsRechercheOffre } from '~/server/offres/domain/offre';
import { mapLocalisation } from '~/server/offres/infra/controller/offreFiltre.mapper';
import { dependencies } from '~/server/start';

interface RechercherOffreEmploiPageProps {
	erreurRecherche?: Erreur
	resultats?: RésultatsRechercheOffre
}

export default function RechercherOffreEmploiPage(props: RechercherOffreEmploiPageProps) {
	const router = useRouter();
	useAnalytics(analytics);

	useEffect(() => {
		if (router.isReady) {
			const queryString = stringify(router.query);
			if (queryString.length === 0) router.replace({ query: 'page=1' }, undefined, { scroll: false });
		}
	}, [router]);

	return <RechercherOffreEmploi resultats={props.resultats} erreurRecherche={props.erreurRecherche} />;
}

const emploisQuerySchema = Joi.object({
	codeLocalisation: Joi.string().alphanum().max(5),
	experienceExigence: Joi.string().valid('D', 'S', 'E'),
	grandDomaine: transformQueryToArray.array().items(Joi.string().valid(...Object.values(DomaineCode as unknown as Record<string, string>))),
	motCle: Joi.string().min(LONGUEUR_MINIMUM_DU_MOT_CLE_REQUISE_PAR_FRANCE_TRAVAIL),
	page: Joi.number().min(1).max(MAX_PAGE_ALLOWED_BY_FRANCE_TRAVAIL).required(),
	tempsDeTravail: Joi.string().valid('tempsPlein', 'tempsPartiel', 'indifférent'),
	typeDeContrats: transformQueryToArray.array().items(Joi.string().valid('CDD', 'CDI', 'SAI', 'MIS')),
	typeLocalisation: Joi.string().valid('REGION', 'DEPARTEMENT', 'COMMUNE'),
}).options({ allowUnknown: true });

type RequestQuery = Partial<{[p: string]: string | string[]}>;

function emploiFiltreMapper(query: RequestQuery): EmploiFiltre {
	return {
		experienceExigence: query.experienceExigence ? String(query.experienceExigence) : undefined,
		grandDomaineList: query.grandDomaine ? queryToArray(query.grandDomaine) : undefined,
		localisation: mapLocalisation(query),
		motClé: query.motCle ? String(query.motCle) : undefined,
		page: Number(query.page),
		tempsDeTravail: query.tempsDeTravail ? String(query.tempsDeTravail) : undefined,
		typeDeContratList: query.typeDeContrats ? queryToArray(query.typeDeContrats) : undefined,
	};
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<RechercherOffreEmploiPageProps>> {
	const { query } = context;

	if (empty(query)) {
		return {
			props: {},
		};
	}

	if (emploisQuerySchema.validate(query).error) {
		return {
			props: {
				erreurRecherche: ErreurMetier.DEMANDE_INCORRECTE,
			},
		};
	}
	const filtres = emploiFiltreMapper(context.query);

	const resultatsRecherche = await dependencies.offreEmploiDependencies.rechercherOffreEmploi.handle(filtres);

	if (isFailure(resultatsRecherche)) {
		changeStatusCodeWhenErrorOcurred(context, resultatsRecherche.errorType);
		return {
			props: {
				erreurRecherche: resultatsRecherche.errorType,
			},
		};
	}
	
	return {
		props: {
			resultats: JSON.parse(JSON.stringify(resultatsRecherche.result)),
		},
	};
}
