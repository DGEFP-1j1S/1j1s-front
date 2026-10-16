import React from 'react';

import commonStyles from '~/client/components/features/ConsulterOffre.module.scss';
import { ConsulterOffreLayout } from '~/client/components/layouts/ConsulterOffre/ConsulterOffreLayout';
import { Link } from '~/client/components/ui/Link/Link';
import { TagList } from '~/client/components/ui/Tag/TagList';
import useSanitize from '~/client/hooks/useSanitize';
import { Offre } from '~/server/offres/domain/offre';

interface ConsulterOffreEmploiProps {
  offreEmploi: Offre
}

export function ConsulterOffreEmploi({ offreEmploi }: ConsulterOffreEmploiProps) {
	const descriptionOffreEmploi = useSanitize(offreEmploi.description);
	const salaireOffreEmploi = useSanitize(offreEmploi.salaire);
	return (
		<ConsulterOffreLayout>
			<header className={commonStyles.titre}>
				<h1>{offreEmploi.intitulé}</h1>
				{offreEmploi.entreprise.nom && <h2>{offreEmploi.entreprise.nom}</h2>}
				<TagList list={offreEmploi.étiquetteList} aria-label="Caractéristiques de l‘offre d‘emploi" />
				<div className={commonStyles.buttonAsLinkWrapper}>
					<div className={commonStyles.buttonAsLink}>
						<Link href={offreEmploi.urlOffreOrigine} appearance="asPrimaryButton">Je postule sur France Travail<Link.Icon /></Link>
					</div>
				</div>
			</header>
			<section className={commonStyles.contenu}>
				{offreEmploi.description && (
					<div>
        	<h3>Description du poste :</h3>
        	<p dangerouslySetInnerHTML={{ __html: descriptionOffreEmploi }} />
					</div>
				)}
				{offreEmploi.compétenceList.length > 0 && (
					<div>
        	<h3>Connaissances et compétences requises :</h3> { ' ' }
        	<ul className={commonStyles.competences}>
        		{ offreEmploi.compétenceList.map((compétence, index) => (
        			<li key={index}>{compétence}</li>
        		))}
        	</ul>
					</div>
				)}
				{offreEmploi.qualitéeProfessionnelleList.length > 0 && (
					<div>
        	<h3>Qualités professionnelles :</h3> { ' ' }
        	<ul className={commonStyles.competences}>
        		{ offreEmploi.qualitéeProfessionnelleList.map((qualitéeProfessionnelle, index) => (
        			<li key={index}>{qualitéeProfessionnelle}</li>
        		))}
        	</ul>
					</div>
				)}
				{offreEmploi.formationList.length > 0 && (
					<div>
        	<h3>Formation requise :</h3> { ' ' }
        	{ offreEmploi.formationList.length === 1
        		?  <p data-testid="FormationParagraph">{offreEmploi.formationList[0].libellé} - {offreEmploi.formationList[0].commentaire}</p>
        		:  (
								<ul className={commonStyles.competences} data-testid="FormationList">
        			{ offreEmploi.formationList.map((formation, index) => (
        				<li key={index}>{formation.libellé} - {formation.commentaire}</li>
        			))}
        		</ul>
							)
        	}
					</div>
				)}
				{offreEmploi.salaire && (
					<div>
        	<h3>Salaire :</h3> { ' ' }
        	<p dangerouslySetInnerHTML={{ __html: salaireOffreEmploi }} />
					</div>
				)}
			</section>
		</ConsulterOffreLayout>
	);
}
