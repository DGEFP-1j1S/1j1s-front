import React from 'react';

import { ConsulterOffreLayout } from '~/client/components/layouts/ConsulterOffre/ConsulterOffreLayout';
import { Link } from '~/client/components/ui/Link/Link';
import useSanitize from '~/client/hooks/useSanitize';
import { formatCarriageReturnToHtml } from '~/client/utils/formatCarriageReturnToHtml';
import { Mission } from '~/server/engagement/domain/engagement';
import { BadgeList } from "~/client/components/ui/Badge/BadgeList";

interface ConsulterMissionEngagementProps {
  missionEngagement: Mission;
}

export function ConsulterMissionEngagement({
	missionEngagement,
}: ConsulterMissionEngagementProps) {
	const descriptionMissionEngagement = useSanitize(
		formatCarriageReturnToHtml(missionEngagement.description),
	);
	const localisationMissionEngagement = useSanitize(
		formatCarriageReturnToHtml(missionEngagement.localisation),
	);

	return (
		<ConsulterOffreLayout>
			<header className="fr-my-5w">
				<h1>{missionEngagement.titre}</h1>
				{missionEngagement.nomEntreprise && (
					<p className="fr-h4">{missionEngagement.nomEntreprise}</p>
				)}
				<BadgeList
					list={missionEngagement.etiquetteList}
					colorClass="fr-badge--blue-cumulus"
					aria-label="Caractéristiques de la mission" />
				{missionEngagement.url && (
					<Link
						href={missionEngagement.url}
						className="fr-btn fr-mt-2w">
						S’engager
					</Link>
				)}
			</header>
			<section className="fr-mb-5w">
				{missionEngagement.localisation && (
					<>
						<h2 className="fr-h5">Où ? </h2>
						<p dangerouslySetInnerHTML={{ __html: localisationMissionEngagement }} />
					</>
				)}
				{missionEngagement.description && (
					<>
						<h2 className="fr-h5">Quoi ? </h2>
						<p dangerouslySetInnerHTML={{ __html: descriptionMissionEngagement }} />
					</>
				)}
				{missionEngagement.debutContrat && (
					<>
						<h2 className="fr-h5">Quand ? </h2>
						<p>
              À partir du {missionEngagement.debutContrat}{' '}
							{missionEngagement.dureeContrat
								? `(${missionEngagement.dureeContrat} Mois)`
								: ''}
						</p>
					</>
				)}
			</section>
		</ConsulterOffreLayout>
	);
}
