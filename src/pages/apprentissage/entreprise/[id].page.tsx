import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import process from 'process';
import React from 'react';

import { Head } from '~/client/components/head/Head';
import { ConsulterOffreLayout } from '~/client/components/layouts/ConsulterOffre/ConsulterOffreLayout';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/apprentissage/[id].analytics';
import { PageContextParamsException } from '~/server/exceptions/pageContextParams.exception';

import styles from './index.module.scss';

export type ConsulterAlternanceEntreprisePageProps = {
	id: string;
}

export async function getServerSideProps(context: GetServerSidePropsContext<{ id: string }>): Promise<GetServerSidePropsResult<ConsulterAlternanceEntreprisePageProps>> {
	const featureActivee = process.env.NEXT_PUBLIC_ALTERNANCE_LBA_FEATURE === '1';
	if (!featureActivee) {
		return { notFound: true };
	}

	if (!context.params) {
		throw new PageContextParamsException();
	}

	const { id } = context.params;

	return {
		props: {
			id: id,
		},
	};
}

export default function AnnonceAlternanceEntreprisePage({ id }: ConsulterAlternanceEntreprisePageProps) {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title={'Candidature spontanée en alternance | 1jeune1solution'}
				robots="noindex" />
			<main id="contenu">
				<ConsulterOffreLayout>
					<iframe
						src={`http://labonnealternance.apprentissage.beta.gouv.fr/emploi/recruteurs_lba/${id}/job`}
						className={styles.iframe}
						title="Formulaire de candidature spontanée en alternance" />
				</ConsulterOffreLayout>
			</main>
		</>
	);
}
