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

	function getTags() {
		const tags = [];
		if (formationInitialeDetail.isCertifiante) tags.push('Certifiante');
		if (formationInitialeDetail.niveauDeSortie) tags.push(formationInitialeDetail.niveauDeSortie);
		if (formationInitialeDetail.duree) tags.push(formationInitialeDetail.duree);
		return tags;
	}

	return (
		<>
			<h1 className="fr-my-2w">{formationInitialeDetail.libelle}</h1>
			<TagList list={getTags()} aria-label="Caractéristiques de la formation" />
			<Link className="fr-btn fr-btn--lg fr-mb-3w" href={formationInitialeDetail.url_formation}>
				Consulter les établissements
			</Link>

			{isFormationInitialeWithCMSDetails && (
				<>
					<SectionDetail titre="Description" contenu={formationInitialeDetail.description} />
					<SectionDetail titre="Attendus Parcoursup" contenu={formationInitialeDetail.attendusParcoursup} />
					<SectionDetail titre="Conditions d‘accès" contenu={formationInitialeDetail.conditionsAcces} />
					<SectionDetail titre="Poursuite d‘études" contenu={formationInitialeDetail.poursuiteEtudes} />
				</>
			)}
			{!isFormationInitialeWithCMSDetails && (
				<p className="fr-my-2w">L‘ONISEP ne fournit pas de description pour cette formation.
					Vous pouvez consulter les établissements pour plus d‘informations.</p>
			)}
		</>
	);
}

function SectionDetail({ titre, contenu }: { titre: string, contenu?: string }) {
	const contenuSanitized = useSanitize(contenu);

	if (!contenu) return null;

	return (
		<div>
			<h2 className="fr-h3">{titre}</h2>
			<div dangerouslySetInnerHTML={{ __html: contenuSanitized }} />
		</div>
	);
}
