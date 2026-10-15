import React from 'react';

import { BackButton } from '~/client/components/features/ButtonRetour/BackButton';
import { ConsulterOffreLayout } from '~/client/components/layouts/ConsulterOffre/ConsulterOffreLayout';
import { Link } from '~/client/components/ui/Link/Link';
import { TagList } from '~/client/components/ui/Tag/TagList';
import useSanitize from '~/client/hooks/useSanitize';
import { Offre } from '~/server/offres/domain/offre';

interface ConsulterOffreEmploiProps {
	offreEmploi: Offre
}

export function ConsulterOffreEmploi({offreEmploi}: ConsulterOffreEmploiProps) {
	const descriptionOffreEmploi = useSanitize(offreEmploi.description);
	const salaireOffreEmploi = useSanitize(offreEmploi.salaire);
	return (
		<div className="fr-container fr-pt-8w">
			<BackButton/>
			<h1 className="fr-h1 fr-my-2w">{offreEmploi.intitulé}</h1>
			{offreEmploi.entreprise.nom && <h3 className="fr-h3">{offreEmploi.entreprise.nom}</h3>}
			<TagList list={offreEmploi.étiquetteList} aria-label="Caractéristiques de l‘offre d‘emploi"/>
			<Link className='fr-btn fr-btn--lg fr-mb-6w' href={offreEmploi.urlOffreOrigine}>Je postule sur France
				Travail</Link>
			<section>
				{offreEmploi.description && (
					<div>
						<h4 className="fr-h4">Description du poste</h4>
						<p dangerouslySetInnerHTML={{__html: descriptionOffreEmploi}}/>
					</div>
				)}
				{offreEmploi.compétenceList.length > 0 && (
					<div className="fr-mb-2w">
						<h4 className="fr-h4">Connaissances et compétences requises :</h4> {' '}
						<ul>
							{offreEmploi.compétenceList.map((compétence, index) => (
								<li key={index}>{compétence}</li>
							))}
						</ul>
					</div>
				)}
				{offreEmploi.qualitéeProfessionnelleList.length > 0 && (
					<div className="fr-mb-2w">
						<h4 className="fr-h4">Qualités professionnelles</h4> {' '}
						<ul>
							{offreEmploi.qualitéeProfessionnelleList.map((qualitéeProfessionnelle, index) => (
								<li key={index}>{qualitéeProfessionnelle}</li>
							))}
						</ul>
					</div>
				)}
				{offreEmploi.formationList.length > 0 && (
					<div className="fr-mb-2w">
						<h4 className="fr-h4">Formation requise</h4> {' '}
						{offreEmploi.formationList.length === 1
							? <p
								data-testid="FormationParagraph">{offreEmploi.formationList[0].libellé} - {offreEmploi.formationList[0].commentaire}</p>
							: (
								<ul data-testid="FormationList">
									{offreEmploi.formationList.map((formation, index) => (
										<li key={index}>{formation.libellé} - {formation.commentaire}</li>
									))}
								</ul>
							)
						}
					</div>
				)}
				{offreEmploi.salaire && (
					<div className="fr-mb-2w">
						<h4 className="fr-h4">Salaire</h4> {' '}
						<p dangerouslySetInnerHTML={{__html: salaireOffreEmploi}}/>
					</div>
				)}
			</section>
		</div>
	);
}
