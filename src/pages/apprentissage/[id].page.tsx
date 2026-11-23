import { GetServerSidePropsContext } from 'next';
import React from 'react';

import { DetailAlternance } from '~/client/components/features/Alternance/DetailAlternance/DetailAlternance';
import { Head } from '~/client/components/head/Head';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/apprentissage/[id].analytics';
import { Alternance } from '~/server/alternances/domain/alternance';
import { GetServerSidePropsResult } from '~/server/errors/getServerSidePropsResultWithError';
import { handleGetServerSidePropsError } from '~/server/errors/handleGetServerSidePropsError';
import { PageContextParamsException } from '~/server/exceptions/pageContextParams.exception';
import { removeUndefinedKeys } from '~/server/removeUndefinedKeys.utils';
import { dependencies } from '~/server/start';

export type AlternanceSerialized = Omit<Alternance, 'dateDébut'> & { dateDébut?: string };
type ConsulterAnnonceAlternancePageProps = {
	alternanceSerialized: AlternanceSerialized;
}

export async function getServerSideProps(context: GetServerSidePropsContext<{ id: string }>): Promise<GetServerSidePropsResult<ConsulterAnnonceAlternancePageProps>> {
	const featureActivee = process.env.NEXT_PUBLIC_ALTERNANCE_LBA_FEATURE === '1';
	if (!featureActivee) {
		return { notFound: true };
	}

	if (!context.params) {
		throw new PageContextParamsException();
	}

	const { id } = context.params;
	const annonce = await dependencies.alternanceDependencies.consulterAlternance.handle(id);

	if (annonce.instance === 'failure') {
		return handleGetServerSidePropsError(context, annonce.errorType);
	}
	const alternance: AlternanceSerialized = {
		...annonce.result,
		dateDébut: annonce.result.dateDébut?.toISOString(),
	};
	return {
		props: {
			alternanceSerialized: removeUndefinedKeys(alternance),
		},
	};
}

export default function AnnonceAlternancePage({ alternanceSerialized }: ConsulterAnnonceAlternancePageProps) {
	useAnalytics(analytics);
	const alternance: Alternance = {
		...alternanceSerialized,
		dateDébut: alternanceSerialized.dateDébut ? new Date(alternanceSerialized.dateDébut) : undefined,
	};

	return (
		<>
			<Head
				title={`${alternanceSerialized.titre} | 1jeune1solution`}
				robots="noindex" />
			<DetailAlternance annonce={alternance} />
		</>
	);
}
