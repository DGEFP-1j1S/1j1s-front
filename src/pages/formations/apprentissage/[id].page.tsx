import React from "react";
import Joi from 'joi';
import { GetServerSidePropsContext } from 'next';

import { ConsulterFormationAlternance } from '~/client/components/features/FormationAlternance/Consulter/ConsulterFormationAlternance';
import { Head } from '~/client/components/head/Head';
import useAnalytics from '~/client/hooks/useAnalytics';
import { queryToArray } from '~/pages/api/utils/queryToArray.util';
import analytics from '~/pages/formations/apprentissage/[id].analytics';
import { isFailure } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { GetServerSidePropsResult } from '~/server/errors/getServerSidePropsResultWithError';
import { handleGetServerSidePropsError } from '~/server/errors/handleGetServerSidePropsError';
import { Formation, FormationFiltreAvecCodeCertification } from '~/server/formations/domain/formation';
import { Statistique } from '~/server/formations/domain/statistique';
import { removeUndefinedKeys } from '~/server/removeUndefinedKeys.utils';
import { dependencies } from '~/server/start';
import { ServiceCardList } from "~/client/components/features/ServiceCard/Card/ServiceCard";
import { Carte } from "~/client/dsfr";

interface ConsulterFormationPageProps {
	formation: Formation
	statistiques?: Statistique
}

export default function ConsulterFormationPage(props: ConsulterFormationPageProps) {
	useAnalytics(analytics);

	const { formation, statistiques } = props;
	return (
		<>
			<Head
				title={`${formation.titre} | 1jeune1solution`}
				robots="noindex" />
			<main id="contenu">
				<ConsulterFormationAlternance formation={formation} statistiques={statistiques} />
				<ServiceCardList>
					<Carte
						horizontal
						lien="/articles/inserjeunes"
						imageSrc="/images/logos/inserjeunes.svg"
						titre="Découvrez le dispositif InserJeunes">
						Inserjeunes est un service d’aide à l’orientation des jeunes qui présente différents indicateurs pour toutes les formations professionnelles.
					</Carte>
				</ServiceCardList>
			</main>
		</>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext<{ id: string }>): Promise<GetServerSidePropsResult<ConsulterFormationPageProps>> {
	const isFormationActive = process.env.NEXT_PUBLIC_FORMATION_LBA_FEATURE === '1';
	if (!isFormationActive) {
		return { notFound: true };
	}

	const formationQuerySchema = Joi.object({
		codeCertification: Joi.string(),
		codeCommune: Joi.string().required(),
		codeRomes: Joi.string().required(),
		distanceCommune: Joi.string().required(),
		id: Joi.string().required(),
		latitudeCommune: Joi.string().required(),
		longitudeCommune: Joi.string().required(),
		niveauEtudes: Joi.string().optional(),
	}).options({ allowUnknown: true });



	if (formationQuerySchema.validate(context.query).error) {
		return handleGetServerSidePropsError(context, ErreurMetier.DEMANDE_INCORRECTE);
	}

	const id = context.params?.id as string;
	const filtre: FormationFiltreAvecCodeCertification = {
		codeCertification: context.query.codeCertification ? String(context.query.codeCertification) : '',
		codeCommune: String(context.query.codeCommune),
		codeRomes: context.query.codeRomes ? queryToArray(context.query.codeRomes) : [],
		distanceCommune: String(context.query.distanceCommune),
		latitudeCommune: String(context.query.latitudeCommune),
		longitudeCommune: String(context.query.longitudeCommune),
		niveauEtudes: context.query.niveauEtudes ? String(context.query.niveauEtudes) : undefined,
	};

	const { formation, statistiques } = await dependencies.formationDependencies.consulterFormation.handle(id, filtre);

	if (isFailure(formation)) {
		return handleGetServerSidePropsError(context, formation.errorType);
	}

	if (!statistiques || isFailure(statistiques)) {
		return {
			props: {
				formation: removeUndefinedKeys(formation.result),
			},
		};
	}

	return {
		props: {
			formation: removeUndefinedKeys(formation.result),
			statistiques: removeUndefinedKeys(statistiques.result),
		},
	};
}
