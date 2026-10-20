import React from 'react';

import { Head } from '~/client/components/head/Head';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/logements/conseils/index.analytics';
import {Banner} from "~/client/components/ui/Hero/Hero";
import {Carte} from "~/client/dsfr";

export default function ConseilsLogement() {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title="Découvrir tous nos conseils logement | 1jeune1solution"
				robots="index,follow" />
			<main id="contenu">
				<div className="fr-container fr-pb-6w">
					<BannièreConseilsLogement />
					<div className="fr-grid-row fr-grid-row--gutters">
						<div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
							<Carte
								imageSrc="/images/articles/documents.svg"
								lien="/articles/comment-constituer-un-dossier-locatif"
								titre="Comment constituer un dossier locatif ?"
								titreAs="h2"
								isContain={true}>
								Constituer son dossier locatif peut sembler compliqué,
							surtout si c’est la première fois ! Vous vous demandez comment vous y prendre ?
							Quels documents rassembler ? Suivez le guide !
							</Carte>
						</div>
						<div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
							<Carte
								imageSrc="/images/articles/consultative-sales.svg"
								lien="/articles/les-garants-a-quoi-ca-sert-et-vers-qui-me-tourner"
								titre="Les garants : à quoi ça sert et vers qui me tourner ?"
								titreAs="h2"
								isContain={true}>
								Vous préparez votre dossier locatif et vous vous
								demandez quel est le rôle d’un garant et comment en trouver un ?
								On vous explique tout pour que vous trouviez une solution adaptée à votre situation.
							</Carte>
						</div>
						<div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
							<Carte
								imageSrc="/images/articles/product-quality.svg"
								lien="/articles/quelles-sont-les-aides-pour-financer-un-logement"
								titre="Quelles sont les aides pour payer un logement ?"
								titreAs="h2"
								isContain={true}>
								Il existe plusieurs dispositifs pour vous aider à
								financer votre loyer tous les mois et vous soutenir au moment de votre installation.
								Comment savoir à quelles aides vous pouvez accéder ? On vous dit tout !
							</Carte>
						</div>
					</div>
				</div>
			</main>
		</>
	);}

function BannièreConseilsLogement() {
	return (
		<Banner>
			<h1 className="fr-h1 fr-mb-0">
				Tout ce qu’il faut savoir et tous nos conseils concernant votre logement
			</h1>
		</Banner>
	);
}
