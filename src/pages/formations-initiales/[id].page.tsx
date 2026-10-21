import { GetServerSidePropsContext } from 'next';
import React from 'react';

import {
	ConsulterDetailFormationInitiale,
} from '~/client/components/features/FormationInitiale/ConsulterDetail/ConsulterDetailFormationInitiale';
import { OnisepGeneralPartner } from '~/client/components/features/ServiceCard/OnisepGeneralPartner';
import { Head } from '~/client/components/head/Head';
import { Container } from '~/client/components/layouts/Container/Container';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import useAnalytics from '~/client/hooks/useAnalytics';
import { DateService } from '~/client/services/date/date.service';
import analytics from '~/pages/formations-initiales/[id].analytics';
import styles from '~/pages/formations-initiales/[id].module.scss';
import { isFailure } from '~/server/errors/either';
import { GetServerSidePropsResult } from '~/server/errors/getServerSidePropsResultWithError';
import { handleGetServerSidePropsError } from '~/server/errors/handleGetServerSidePropsError';
import { PageContextParamsException } from '~/server/exceptions/pageContextParams.exception';
import {
	FormationInitialeDetailAvecInformationsComplementaires,
	isFormationWithComplementaryInformation,
} from '~/server/formations-initiales/domain/formationInitiale';
import { dependencies } from '~/server/start';

type ConsulterDetailFormationInitialePageProps = {
	formationInitialeDetail: FormationInitialeDetailAvecInformationsComplementaires;
}

export async function getServerSideProps(context: GetServerSidePropsContext<{
	id: string
}>): Promise<GetServerSidePropsResult<ConsulterDetailFormationInitialePageProps>> {
	const isFormationsInitalesActive = process.env.NEXT_PUBLIC_FORMATIONS_INITIALES_FEATURE === '1';
	if (!isFormationsInitalesActive) {
		return {
			notFound: true,
		};
	}

	if (!context.params) {
		throw new PageContextParamsException();
	}

	const { id } = context.params;
	const formationInitialeDetailComplete = await dependencies.formationInitialeDependencies.consulterDetailFormationInitiale.handle(id);

	if (isFailure(formationInitialeDetailComplete)) {
		return handleGetServerSidePropsError(context, formationInitialeDetailComplete.errorType);
	}

	return {
		props: {
			formationInitialeDetail: formationInitialeDetailComplete.result,
		},
	};
}


export default function ConsulterFormationInitialePage({ formationInitialeDetail }: ConsulterDetailFormationInitialePageProps) {
	const dateService = useDependency<DateService>('dateService');
	useAnalytics(analytics);

	const dateDeMiseAJour = isFormationWithComplementaryInformation(formationInitialeDetail) 
		? new Date(formationInitialeDetail.dateDeMiseAJour)
		: dateService.today();

	const dataUpdatedDate = dateService.formatToHumanReadableDate(dateDeMiseAJour);

	return (
		<>
			<Head
				title={`${formationInitialeDetail.libelle} | 1jeune1solution`}
				robots="noindex" />
			<ConsulterDetailFormationInitiale formationInitialeDetail={formationInitialeDetail} />

			<Container className={styles.container}>
				<OnisepGeneralPartner headingLevel={'h2'} />
				<div className={styles.partnerInfo}>
					<span className="fr-icon-information-line fr-mr-1w" aria-hidden="true" />{`Idéo-fiches formations, Onisep, ${dataUpdatedDate}, sous licence ODBL`}
				</div>
			</Container>
		</>
	);
};


