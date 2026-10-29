import Joi from 'joi';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import React from 'react';

import { RechercherAnnonceDeLogement } from '~/client/components/features/Logement/Rechercher/RechercherAnnonceDeLogement';
import { Head } from '~/client/components/head/Head';
import ErrorUnavailableService from '~/client/components/layouts/Error/ErrorUnavailableService';
import useAnalytics from '~/client/hooks/useAnalytics';
import { transformQueryToArray } from '~/pages/api/utils/joi/joi.util';
import { queryToArray } from '~/pages/api/utils/queryToArray.util';
import analytics from '~/pages/logements/annonces/index.analytics';
import { isFailure } from '~/server/errors/either';
import { Erreur } from '~/server/errors/erreur.types';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { changeStatusCodeWhenErrorOcurred } from '~/server/errors/handleGetServerSidePropsError';
import {
	FiltreRechercheAnnonceDeLogement,
	ResultatsRechercheAnnonceDeLogement,
} from '~/server/logements/domain/rechercheAnnonceDeLogement';
import { dependencies } from '~/server/start';

interface AnnoncesPageProps {
	erreurRecherche?: Erreur
	resultats?: ResultatsRechercheAnnonceDeLogement
}

function isRechercheLogementActive() {
	return process.env.NEXT_PUBLIC_LOGEMENT_FEATURE === '1';
}

export default function AnnoncesPage(props: AnnoncesPageProps) {
	useAnalytics(analytics);

	if (!isRechercheLogementActive()) return <ErrorUnavailableService />;
	return (
		<>
			<Head
				title="Rechercher un logement | 1jeune1solution"
				description="Logement étudiant et location jeune actif partout en France"
				robots="index,follow" />
			<RechercherAnnonceDeLogement resultats={props.resultats} erreurRecherche={props.erreurRecherche} />
		</>
	);
}

const LONGUEUR_MAXIMUM_DES_VALEURS = 200;
const listeDeValeurs = transformQueryToArray.array().items(Joi.string().max(LONGUEUR_MAXIMUM_DES_VALEURS));
const borne = Joi.number().min(0);

const annonceDeLogementQuerySchema = Joi.object({
	page: Joi.number().integer().min(1),
	prixMax: borne,
	prixMin: borne,
	surfaceMax: borne,
	surfaceMin: borne,
	typesBien: listeDeValeurs,
	typesOffre: listeDeValeurs,
	ville: Joi.string().max(LONGUEUR_MAXIMUM_DES_VALEURS),
}).options({ allowUnknown: true });

type RequestQuery = Partial<{ [p: string]: string | string[] }>;

function versNombre(valeur: RequestQuery[string]) {
	return valeur ? Number(valeur) : undefined;
}

function annonceDeLogementFiltreMapper(query: RequestQuery): FiltreRechercheAnnonceDeLogement {
	return {
		page: query.page ? Number(query.page) : 1,
		prix: { max: versNombre(query.prixMax), min: versNombre(query.prixMin) },
		surface: { max: versNombre(query.surfaceMax), min: versNombre(query.surfaceMin) },
		typesBien: query.typesBien ? queryToArray(query.typesBien) : [],
		typesOffre: query.typesOffre ? queryToArray(query.typesOffre) : [],
		ville: query.ville ? String(query.ville) : undefined,
	};
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<AnnoncesPageProps>> {
	if (!isRechercheLogementActive()) {
		return { props: {} };
	}

	if (annonceDeLogementQuerySchema.validate(context.query).error) {
		changeStatusCodeWhenErrorOcurred(context, ErreurMetier.DEMANDE_INCORRECTE);
		return { props: { erreurRecherche: ErreurMetier.DEMANDE_INCORRECTE } };
	}

	const resultatsRecherche = await dependencies.annonceDeLogementDependencies.rechercherAnnonceDeLogement.handle(annonceDeLogementFiltreMapper(context.query));

	if (isFailure(resultatsRecherche)) {
		changeStatusCodeWhenErrorOcurred(context, resultatsRecherche.errorType);
		return { props: { erreurRecherche: resultatsRecherche.errorType } };
	}

	return { props: { resultats: JSON.parse(JSON.stringify(resultatsRecherche.result)) } };
}
