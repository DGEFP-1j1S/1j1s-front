import React from 'react';

import { Link } from '~/client/components/ui/Link/Link';
import { TagList } from '~/client/components/ui/Tag/TagList';
import useSanitize from '~/client/hooks/useSanitize';
import {
	FormationInitialeDetailAvecInformationsComplementaires,
	isFormationWithComplementaryInformation,
} from '~/server/formations-initiales/domain/formationInitiale';

export function ConsulterDetailFormationInitiale({ formationInitialeDetail }: {
	formationInitialeDetail: FormationInitialeDetailAvecInformationsComplementaires
}) {
	const isFormationInitialeWithCMSDetails = isFormationWithComplementaryInformation(formationInitialeDetail);

	const descriptionDirty = isFormationInitialeWithCMSDetails ? formationInitialeDetail.description : undefined;
	const attendusParcoursupDirty = isFormationInitialeWithCMSDetails ? formationInitialeDetail.attendusParcoursup : undefined;
	const conditionsAccesDirty = isFormationInitialeWithCMSDetails ? formationInitialeDetail.conditionsAcces : undefined;
	const poursuiteEtudesDirty = isFormationInitialeWithCMSDetails ? formationInitialeDetail.poursuiteEtudes : undefined;

	const descriptionSanitized = useSanitize(descriptionDirty);
	const attendusParcoursupSanitized = useSanitize(attendusParcoursupDirty);
	const conditionsAccesSanitized = useSanitize(conditionsAccesDirty);
	const poursuiteEtudesSanitized = useSanitize(poursuiteEtudesDirty);

	function getTags() {
		const tags = [];
		if (formationInitialeDetail.isCertifiante) tags.push('Certifiante');
		if (formationInitialeDetail.niveauDeSortie) tags.push(formationInitialeDetail.niveauDeSortie);
		if (formationInitialeDetail.duree) tags.push(formationInitialeDetail.duree);
		return tags;
	}

	return (
		<main id="contenu" className="fr-container">
			<BackButton/>
			<h1 className="fr-my-2w">{formationInitialeDetail.libelle}</h1>
			<TagList list={getTags()} aria-label="Caractéristiques de la formation" />
			<Link className="fr-btn fr-btn--large fr-mb-3w" href={formationInitialeDetail.url_formation}>
				Consulter les établissements
			</Link>

			{isFormationInitialeWithCMSDetails && (
				<section>
					{formationInitialeDetail.description && (
						<div>
							<h2 className="fr-h3">Description</h2>
							<div dangerouslySetInnerHTML={{ __html: descriptionSanitized }} />
						</div>
					)}
					{formationInitialeDetail.attendusParcoursup && (
						<div>
							<h2 className="fr-h3">Attendus Parcoursup</h2>
							<div dangerouslySetInnerHTML={{ __html: attendusParcoursupSanitized }} />
						</div>
					)}
					{formationInitialeDetail.conditionsAcces && (
						<div>
							<h2 className="fr-h3">Conditions d‘accès</h2>
							<div dangerouslySetInnerHTML={{ __html: conditionsAccesSanitized }} />
						</div>
					)}
					{formationInitialeDetail.poursuiteEtudes && (
						<div>
							<h2 className="fr-h3">Poursuite d‘études</h2>
							<div dangerouslySetInnerHTML={{ __html: poursuiteEtudesSanitized }} />
						</div>
					)}
				</section>
			)}
			{!isFormationInitialeWithCMSDetails && (
				<p className="fr-my-2w">L‘ONISEP ne fournit pas de description pour cette formation.
					Vous pouvez consulter les établissements pour plus d‘informations.</p>
			)}
		</main>
	);
}
