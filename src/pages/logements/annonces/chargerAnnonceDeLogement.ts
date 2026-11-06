import { GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";

import { GetServerSidePropsResult } from "~/server/errors/getServerSidePropsResultWithError";
import { handleGetServerSidePropsError } from "~/server/errors/handleGetServerSidePropsError";
import { PageContextParamsException } from "~/server/exceptions/pageContextParams.exception";
import { AnnonceDeLogement } from "~/server/logements/domain/annonceDeLogement";
import { dependencies } from "~/server/start";

export interface AnnonceDeLogementContext extends ParsedUrlQuery {
	id: string
}

type FonctionnaliteDesactivee = { isFeatureActive: false }

export async function chargerAnnonceDeLogement<Props extends object>(
	context: GetServerSidePropsContext<AnnonceDeLogementContext>,
	versProps: (annonceDeLogement: AnnonceDeLogement, slug: string) => Props,
): Promise<GetServerSidePropsResult<(Props & { isFeatureActive: true }) | FonctionnaliteDesactivee>> {
	const displayAnnoncesLogement = process.env.NEXT_PUBLIC_LOGEMENT_FEATURE === "1";
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
	if (annonceDeLogement.instance === "failure") {
		return handleGetServerSidePropsError(context, annonceDeLogement.errorType);
	}

	return {
		props: {
			...versProps(annonceDeLogement.result, slug),
			isFeatureActive: true,
		},
	};
}
