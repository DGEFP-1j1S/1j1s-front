import React from 'react';

import { getTagsFromAnnonce } from '~/client/components/features/EmploisEurope/tags.utils';
import { Link } from '~/client/components/ui/Link/Link';
import { TagList } from '~/client/components/ui/Tag/TagList';
import useSanitize from '~/client/hooks/useSanitize';
import {
	EmploiEurope,
	ExperienceNecessaire,
	LanguageSpecificationCompetence,
} from '~/server/emplois-europe/domain/emploiEurope';
import { UNITE_EXPERIENCE_NECESSAIRE } from '~/server/emplois-europe/infra/uniteExperienceNecessaire';
import { capitalizeFirstLetter } from "~/server/services/utils/capitalizeFirstLetter.util";

interface ConsulterOffreEmploiEuropeProps {
	annonceEmploiEurope: EmploiEurope
}

export function DetailEmploiEurope({ annonceEmploiEurope }: ConsulterOffreEmploiEuropeProps) {
	const descriptionSanitized = useSanitize(annonceEmploiEurope.description);
	const competencesLinguistiques = annonceEmploiEurope.competencesLinguistiques;
	const codeLangueDeLOffre = annonceEmploiEurope.codeLangueDeLOffre ?? '';

	function getDetailLanguageCompetence(detailCompetenceLanguistique: Array<LanguageSpecificationCompetence>) {
		return (
			<ul>
				{detailCompetenceLanguistique?.map((specification, index) => {
					return (
						<li key={`${specification.nomCompetence}-${index}`} className="fr-ml-2w">
							{capitalizeFirstLetter(specification.nomCompetence)} ({specification.codeDuNiveauDeLaCompetence} - {specification.nomDuNiveauDeLaCompetence})
						</li>
					);
				})}
			</ul>
		);
	}

	function getCompetencesLinguistiquesRequises() {
		return competencesLinguistiques?.map((competence) => {
			return (
				<div key={competence.langage} className="fr-mt-1w">
					<strong>{capitalizeFirstLetter(competence.langage)}</strong> ({competence.codeDuNiveauDeLangue} - {competence.nomDuNiveauDeLangue})
					{getDetailLanguageCompetence(competence.detailCompetenceLanguistique)}
				</div>
			);
		});
	}

	function getLibelleLocalisation(localisation: { pays?: string, ville?: string}) {
		if (localisation.pays && localisation.ville) {
			return `${localisation.pays}, ${localisation.ville}`;
		} else {
			return localisation.ville || localisation.pays;
		}
	}

	function getLocalisations() {
		if (annonceEmploiEurope.localisations.length > 1) {
			return (
				<ul>
					{annonceEmploiEurope.localisations.map((localisation) => (
						<li key={`${localisation.pays}-${localisation.ville}`}>
							{getLibelleLocalisation(localisation)}
						</li>
					))}
				</ul>
			);
		} else {
			return getLibelleLocalisation(annonceEmploiEurope.localisations[0]);
		}
	}

	function getExperienceRequired(experienceNecessaire: ExperienceNecessaire) {
		if (experienceNecessaire.duree === 0) return 'Aucune expérience requise';
		const isPlural = experienceNecessaire.duree > 1;

		switch (experienceNecessaire.unite) {
			case UNITE_EXPERIENCE_NECESSAIRE.MONTH:
				return `${experienceNecessaire.duree} mois`;
			case UNITE_EXPERIENCE_NECESSAIRE.WEEK:
				return `${experienceNecessaire.duree} semaine${isPlural ? 's' : ''}`;
			case UNITE_EXPERIENCE_NECESSAIRE.YEAR:
				return `${experienceNecessaire.duree} an${isPlural ? 's' : ''}`;
			case UNITE_EXPERIENCE_NECESSAIRE.DAY:
				return `${experienceNecessaire.duree} jour${isPlural ? 's' : ''}`;
			default:
				return `${experienceNecessaire.duree} (non spécifié)`;
		}
	}

	return (
		<div className="fr-container">
			{annonceEmploiEurope.titre ? <h1 className="fr-h1 fr-my-2w" lang={codeLangueDeLOffre}>{annonceEmploiEurope.titre}</h1>
				: <h1 className="fr-h1 fr-my-2w">Offre d’emploi sans titre</h1>}
			{annonceEmploiEurope.nomEntreprise && <p className="fr-text--lead">{annonceEmploiEurope.nomEntreprise}</p>}
			<TagList
				list={getTagsFromAnnonce(annonceEmploiEurope)}
							 aria-label="Caractéristiques de l‘offre d‘emploi" />
			{annonceEmploiEurope.urlCandidature && (
				<Link className="fr-btn fr-btn--lg fr-mb-6w" href={annonceEmploiEurope.urlCandidature}>Je postule sur Eures</Link>
			)}
			<section>
				<dl className="fr-p-0">
					{annonceEmploiEurope.description && (
						<div className="fr-mb-2w">
							<dt className="fr-h3 fr-mb-1w">Description du poste</dt>
							<dd style={{ whiteSpace: "pre-line" }} dangerouslySetInnerHTML={{ __html: descriptionSanitized }} lang={codeLangueDeLOffre} />
						</div>
					)}
					{annonceEmploiEurope.localisations.length > 0 && (
						<div className="fr-mb-2w">
							<dt className="fr-h3 fr-mb-1w">{annonceEmploiEurope.localisations.length > 1 ? 'Localisations' : 'Localisation'}</dt>
							<dd>{getLocalisations()}</dd>
						</div>
					)}
					{annonceEmploiEurope.langueDeTravail.length > 0 && (
						<div className="fr-mb-2w">
							<dt className="fr-h3 fr-mb-1w">Langue de travail</dt>
							<dd>{capitalizeFirstLetter(annonceEmploiEurope.langueDeTravail.join(', '))}</dd>
						</div>
					)}
					{competencesLinguistiques?.length > 0 && (
						<div className="fr-mb-2w">
							<dt className="fr-h3 fr-mb-1w">Compétences linguistiques requises</dt>
							<dd>{getCompetencesLinguistiquesRequises()}</dd>
						</div>
					)}
					{annonceEmploiEurope.laPlusLongueExperienceNecessaire !== undefined && (
						<div className="fr-mb-2w">
							<dt className="fr-h3 fr-mb-1w">Expérience</dt>
							<dd>{getExperienceRequired(annonceEmploiEurope.laPlusLongueExperienceNecessaire)}</dd>
						</div>
					)}
					{annonceEmploiEurope.listePermis?.length > 0 && (
						<div className="fr-mb-2w">
							<dt className="fr-h3 fr-mb-1w">Type de permis requis</dt>
							<dd>{annonceEmploiEurope.listePermis.join(', ')}</dd>
						</div>
					)}
				</dl>
			</section>
		</div>
	);
}
