import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';

import { BackButton } from '~/client/components/features/ButtonRetour/BackButton';
import { ConsulterFicheMetier } from '~/client/components/features/FicheMetier/Consulter/ConsulterFicheMetier';
import { OnisepGeneralPartner } from '~/client/components/features/ServiceCard/OnisepGeneralPartner';
import { Head } from '~/client/components/head/Head';
import useAnalytics from '~/client/hooks/useAnalytics';
import { usePopstate } from '~/client/hooks/usePopstate';
import analytics from '~/pages/decouvrir-les-metiers/[nomMetier].analytics';
import { isFailure } from '~/server/errors/either';
import { PageContextParamsException } from '~/server/exceptions/pageContextParams.exception';
import { FicheMétier } from '~/server/fiche-metier/domain/ficheMetier';
import { dependencies } from '~/server/start';

interface ConsulterFicheMetierPageProps {
	ficheMetier: FicheMétier
}

export default function ConsulterFicheMetierPage({ ficheMetier }: ConsulterFicheMetierPageProps) {
	useAnalytics(analytics);
	usePopstate();

	if (!ficheMetier) return null;

	return (
		<>
			<Head
				title={`${ficheMetier.nomMetier.charAt(0).toUpperCase()}${ficheMetier.nomMetier.slice(1)} | 1jeune1solution`}
				robots="index,follow" />
			<main id="contenu">
				<div className="fr-container">
					<BackButton />
					<ConsulterFicheMetier ficheMetier={ficheMetier} />
				</div>

				<section className="fr-container fr-mb-7w">
					<h2>Informations fournies par ONISEP</h2>
					<p className="fr-icon-information-line">Idéo-fiches métiers, Onisep, 14/09/2022, sous licence ODBL</p>
					<OnisepGeneralPartner headingLevel={'h3'} />
				</section>
			</main>
		</>
	);
}

interface FicheMetierContext extends ParsedUrlQuery {
	nomMetier: string
}

export async function getStaticProps(context: GetStaticPropsContext<FicheMetierContext>): Promise<GetStaticPropsResult<ConsulterFicheMetierPageProps>> {
	if (!context.params) {
		throw new PageContextParamsException();
	}

	const { nomMetier } = context.params;
	const response = await dependencies.ficheMetierDependencies.consulterFicheMetier.handle(nomMetier);

	if (response.instance === 'failure') {
		return { notFound: true, revalidate: 1 };
	}

	return {
		props: {
			ficheMetier: JSON.parse(JSON.stringify(response.result)),
		},
		revalidate: 86400,
	};
}


export async function getStaticPaths(): Promise<GetStaticPathsResult> {
	const NomMetierFicheMetierList = await dependencies.ficheMetierDependencies.listerNomsMetiers.handle();

	if (isFailure(NomMetierFicheMetierList)) {
		return {
			fallback: 'blocking',
			paths: [],
		};
	}

	const paths = NomMetierFicheMetierList.result.map((nomMetier) => ({
		params: { nomMetier: nomMetier },
	}));
	return {
		fallback: 'blocking',
		paths,
	};
}
