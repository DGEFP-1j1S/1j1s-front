import classNames from 'classnames';
import React, { useMemo } from 'react';

import { FoldingSection } from '~/client/components/ui/FoldingSection/FoldingSection';
import MarkdownToHtml from '~/client/components/ui/MarkdownToHtml/MarkdownToHtml';
import { TagList } from '~/client/components/ui/Tag/TagList';
import { FicheMétier } from '~/server/fiche-metier/domain/ficheMetier';

import styles from './ConsulterFicheMétier.module.scss';

export function ConsulterFicheMétier({ ficheMetier }: { ficheMetier: FicheMétier }) {
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

	const displayedNomMetier = useMemo(() => capitalizeFirstLetter(nomMetier), [nomMetier]);
	const displayedNiveauAccesMin = useMemo(() =>
		niveauAccesMin.map((niveau) => niveau.libelle).join(', '), [niveauAccesMin]);
	const displayedStatuts = useMemo(() =>
		statuts.map((statut) => statut.libelle).join(', '), [statuts]);
	const displayedCentresInteret = useMemo(() =>
		centresInteret.map((centre) => centre.libelle), [centresInteret]);

	return (
		<>
			<section className={styles.section}>
				<h1 className={styles.mainTitle}>{displayedNomMetier}</h1>
				<div className={classNames(styles.abstractSection, styles.sectionContent)}>
					{secteursActivite.length > 0 && (
						<div className={styles.fieldDomaine}>
							<span className={styles.fieldLabel}>Domaine(s) :</span>
							<div className={styles.fieldContent}>
								<TagList list={secteursActivite.map((fiche) => fiche.libelle)} />
							</div>
						</div>
					)}
					{accrocheMetier && (
						<div className={styles.fieldRésumé}>
							<span className={styles.fieldLabel}>Résumé :</span>
							{accrocheMetier &&
							<div className={styles.fieldContent} dangerouslySetInnerHTML={{ __html: accrocheMetier }} />}
						</div>
					)}
					{niveauAccesMin.length > 0 && (
						<div className={styles.fieldNiveauAccès}>
							<span className={styles.fieldLabel}>Niveau d‘accès minimum :</span>
							{niveauAccesMin && <div className={styles.fieldContent}>{displayedNiveauAccesMin}</div>}
						</div>
					)}
					{statuts.length > 0 && (
						<div className={styles.fieldStatutsPro}>
							<span className={styles.fieldLabel}>Statuts professionnels :</span>
							{statuts && <div className={styles.fieldContent}>{displayedStatuts}</div>}
						</div>
					)}
				</div>
			</section>
			{natureTravail && (
				<FoldingSection summary="Nature du travail" open={true}>
					<MarkdownToHtml markdown={natureTravail} />
				</FoldingSection>
			)}
			{competences && (
				<FoldingSection summary="Compétences requises">
					<MarkdownToHtml markdown={competences} />
				</FoldingSection>
			)}
			{conditionTravail && (
				<FoldingSection summary="Lieu d‘exercice et status">
					<MarkdownToHtml markdown={conditionTravail} />
				</FoldingSection>
			)}
			{vieProfessionnelle && (
				<FoldingSection summary="Carrière et salaire">
					<MarkdownToHtml markdown={vieProfessionnelle} />
				</FoldingSection>
			)}
			{accesMetier && (
				<FoldingSection summary="Accès au métier">
					<MarkdownToHtml markdown={accesMetier} />
				</FoldingSection>
			)}
			{centresInteret && centresInteret.length > 0 && (
				<section className={styles.section}>
					<h2 className={styles.lastSectionTitle}>Centres d‘intérêt</h2>
					<div className={styles.sectionContent}>
						<TagList list={displayedCentresInteret} />
					</div>
				</section>
			)}
		</>
	);
}
