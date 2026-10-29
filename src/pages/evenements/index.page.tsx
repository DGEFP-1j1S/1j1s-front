import Joi from 'joi';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import React from 'react';

import { RechercherEvenement } from '~/client/components/features/Evenement/Rechercher/RechercherEvenement';
import { Head } from '~/client/components/head/Head';
import { HeroWithButtonLink } from '~/client/components/ui/Hero/HeroWithButtonLink';
import useAnalytics from '~/client/hooks/useAnalytics';
import { transformQueryToArray } from '~/pages/api/utils/joi/joi.util';
import { queryToArray } from '~/pages/api/utils/queryToArray.util';
import analytics from '~/pages/evenements/index.analytics';
import { isFailure } from '~/server/errors/either';
import { Erreur } from '~/server/errors/erreur.types';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { changeStatusCodeWhenErrorOcurred } from '~/server/errors/handleGetServerSidePropsError';
import { FiltreRechercheEvenement, ResultatsRechercheEvenement } from '~/server/evenements/domain/rechercheEvenement';
import { dependencies } from '~/server/start';

interface PageEvenementsProps {
	erreurRecherche?: Erreur
	resultats?: ResultatsRechercheEvenement
}

function isRechercheEvenementActive() {
	return process.env.NEXT_PUBLIC_RECHERCHE_EVENEMENT_FEATURE === '1';
}

export default function PageEvenements(props: PageEvenementsProps) {
	useAnalytics(analytics);
	const displayRechercheEvenement = isRechercheEvenementActive();

	return (
		<>
			{
				!displayRechercheEvenement && (
					<>
						<Head
							title={'Trouver un évènement Emploi | 1jeune1solution'}
							robots="index,follow" />
						<main id='contenu'>
							<HeroWithButtonLink
								title="Des centaines d‘événements de recrutement pour tous les jeunes, partout en France"
								content='À la recherche d’un emploi ou d’une formation ?
              Dépassez les frontières du virtuel en allant directement à la rencontre de votre futur employeur,
              en participant à des ateliers thématiques ou en assistant à une conférence près de chez vous !'
								buttonLabel='Trouver un événement France Travail'
								buttonLabelSecondary='Trouver un événement ma Mission Locale'
								buttonHref='https://mesevenementsemploi.francetravail.fr/mes-evenements-emploi/evenements'
								buttonHrefSecondary='https://www.unml.info/actualites/nos-actualites/?category=154&post_tag='
								imgSrc='/images/évènements.webp' />
						</main>
					</>
				)
			}
			{displayRechercheEvenement && (
				<>
					<Head
						title={'Rechercher un évènement | 1jeune1solution'}
						description="Des centaines d‘évènements de recrutement pour tous les jeunes, partout en France"
						robots="index,follow" />
					<RechercherEvenement resultats={props.resultats} erreurRecherche={props.erreurRecherche} />
				</>
			)
			}
		</>
	);
}

const LONGUEUR_MAXIMUM_DES_VALEURS = 200;

const evenementQuerySchema = Joi.object({
	lieux: transformQueryToArray.array().items(Joi.string().max(LONGUEUR_MAXIMUM_DES_VALEURS)),
	motCle: Joi.string().max(LONGUEUR_MAXIMUM_DES_VALEURS),
	page: Joi.number().integer().min(1),
}).options({ allowUnknown: true });

type RequestQuery = Partial<{ [p: string]: string | string[] }>;

function evenementFiltreMapper(query: RequestQuery): FiltreRechercheEvenement {
	return {
		lieux: query.lieux ? queryToArray(query.lieux) : [],
		motCle: query.motCle ? String(query.motCle) : undefined,
		page: query.page ? Number(query.page) : 1,
	};
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<PageEvenementsProps>> {
	if (!isRechercheEvenementActive()) {
		return { props: {} };
	}

	if (evenementQuerySchema.validate(context.query).error) {
		changeStatusCodeWhenErrorOcurred(context, ErreurMetier.DEMANDE_INCORRECTE);
		return { props: { erreurRecherche: ErreurMetier.DEMANDE_INCORRECTE } };
	}

	const resultatsRecherche = await dependencies.evenementDependencies.rechercherEvenement.handle(evenementFiltreMapper(context.query));

	if (isFailure(resultatsRecherche)) {
		changeStatusCodeWhenErrorOcurred(context, resultatsRecherche.errorType);
		return { props: { erreurRecherche: resultatsRecherche.errorType } };
	}

	return { props: { resultats: JSON.parse(JSON.stringify(resultatsRecherche.result)) } };
}
