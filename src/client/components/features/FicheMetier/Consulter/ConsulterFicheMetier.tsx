import React, { useMemo } from 'react';

import MarkdownToHtml from '~/client/components/ui/MarkdownToHtml/MarkdownToHtml';
import { FicheMétier } from '~/server/fiche-metier/domain/ficheMetier';

import { BadgeList } from "~/client/components/ui/Badge/BadgeList";
import { Accordion } from "~/client/dsfr";

export function ConsulterFicheMetier({ ficheMetier }: { ficheMetier: FicheMétier }) {
	const {
		accesMetier,
		accrocheMetier,
		centresInteret,
		competences,
		conditionTravail,
		natureTravail,
		niveauAccesMin,
		nomMetier,
		secteursActivite,
		statuts,
		vieProfessionnelle,
	} = ficheMetier;

	const capitalizeFirstLetter = (sentence: string) => `${sentence.charAt(0).toUpperCase()}${sentence.slice(1)}` || '';

	const displaySynthese = niveauAccesMin.length > 0 || statuts.length > 0 || centresInteret && centresInteret.length > 0
	const displayedNomMetier = useMemo(() => capitalizeFirstLetter(nomMetier), [nomMetier]);
	const displayedNiveauAccesMin = useMemo(() =>
		niveauAccesMin.map((niveau) => niveau.libelle).join(', '), [niveauAccesMin]);
	const displayedStatuts = useMemo(() =>
		statuts.map((statut) => statut.libelle).join(', '), [statuts]);
	const displayedCentresInteret = useMemo(() =>
		centresInteret.map((centre) => centre.libelle), [centresInteret]);

	return (
		<article className="fr-mx-md-15w fr-mb-3w">
			<section>
				<h1 className="fr-mt-5w">{displayedNomMetier}</h1>
				{ secteursActivite.length > 0 && (
					<BadgeList 
						className="fr-mb-7w"
						colorClass="fr-badge--blue-cumulus" 
						list={secteursActivite.map((fiche) => fiche.libelle)} />
				)}

				{ accrocheMetier && (
					<section className="fr-mb-7w">
						<h2 className="fr-h4">Résumé :</h2>
						<div dangerouslySetInnerHTML={{ __html: accrocheMetier }} />
					</section>
				)}

				{ displaySynthese && (
					<div className="background--blue-france fr-p-3v fr-mb-7w">
						<h2 className="fr-h4">En synthèse :</h2>
						<ul className="fr-grid-row">
							{ niveauAccesMin.length > 0 && (
								<li className="list-style-none fr-icon-award-line fr-col-6 fr-pl-1w">
									<span className="fr-ml-2w">Niveau : <span className='fr-text--bold'>{displayedNiveauAccesMin}</span></span>
								</li>
							)}
							{ statuts.length > 0 && (
								<li className="list-style-none fr-icon-building-line fr-col-6 fr-pl-1w">
									<span className="fr-ml-2w">Statut : <span className='fr-text--bold'>{displayedStatuts}</span></span>
								</li>
							)}
							{ centresInteret && centresInteret.length > 0 && (
								<li className="list-style-none fr-icon-eye-line fr-col-6 fr-pl-1w">
									<span className="fr-ml-2w">Centres d&#39;intérêt : <span className='fr-text--bold'>{displayedCentresInteret}</span></span>
								</li>
							)}
						</ul>
					</div>
				)}
			</section>

			<div className="fr-accordions-group fr-mb-7w">
				{ natureTravail && (
					<Accordion titreAs="h2" titre="Nature du travail" expanded={true}>
						<MarkdownToHtml markdown={natureTravail} />
					</Accordion>
				)}
				{ competences && (
					<Accordion titreAs="h2" titre="Compétences requises">
						<MarkdownToHtml markdown={competences} />
					</Accordion>
				)}
				{ conditionTravail && (
					<Accordion titreAs="h2" titre="Lieu d‘exercice et statut">
						<MarkdownToHtml markdown={conditionTravail} />
					</Accordion>
				)}
				{ vieProfessionnelle && (
					<Accordion titreAs="h2" titre="Carrière et salaire">
						<MarkdownToHtml markdown={vieProfessionnelle} />
					</Accordion>
				)}
				{ accesMetier && (
					<Accordion titreAs="h2" titre="Accès au métier">
						<MarkdownToHtml markdown={accesMetier} />
					</Accordion>
				)}
			</div>
		</article>
	);
}
