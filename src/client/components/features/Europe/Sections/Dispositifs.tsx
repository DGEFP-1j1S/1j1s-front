import React from "react";

import { Link } from '~/client/components/ui/Link/Link';
import { Carte } from "~/client/dsfr";

export function Dispositifs() {
	return (
		<section className="background--blue-light fr-py-5w">
			<div className="fr-container">
				<h2 className="fr-h3">Je découvre les dispositifs pour m’accompagner dans mon projet</h2>
				<ul className="fr-grid-row fr-grid-row--gutters list-style-none fr-pl-0 fr-mb-3w" aria-label="Dispositifs d'accompagnement">
					<li className="fr-col-12 fr-col-lg-6"><EuresCardContent /></li>
					<li className="fr-col-12 fr-col-lg-6"><ErasmusCardContent /></li>
				</ul>
				<AidesFinancieresCardContent />
			</div>
		</section>
	);
}

function CarteDispositif({ children, lien }: React.PropsWithChildren<{ lien: React.ReactNode }>) {
	return (
		<div className="fr-card height--full">
			<div className="fr-card__body">
				<div className="fr-card__content">{children}</div>
				<div className="fr-card__footer">{lien}</div>
			</div>
		</div>
	);
}

const classNameLienExterne = "fr-btn fr-btn--icon-right fr-icon-external-link-line";

function EuresCardContent() {
	return (
		<CarteDispositif lien={
			<Link
				className={classNameLienExterne}
				href="https://eures.europa.eu/index_fr"
				aria-label="En savoir plus sur EURES - nouvelle fenêtre">
				En savoir plus
			</Link>
		}>
			<h3 id="eures" className="fr-card__title">Le programme de mobilité ciblé EURES</h3>
			<div className="fr-card__desc">
			<dl>
				<dt className="fr-text--bold">Comment cela fonctionne ?</dt>
				<dd>Il vous aide à trouver un emploi, une formation ou un apprentissage dans un autre État membre de l’Union
					européenne.
				</dd>
				<dt className="fr-text--bold">Pour qui ?</dt>
				<dd>Tout demandeur d’emploi de plus de 18 ans ; indépendamment de ses qualifications.</dd>
				<dt className="fr-text--bold">Pour quelle durée ?</dt>
				<dd>Contrat de 3 mois minimum pour les stages</dd>
				<dd>Contrat de 6 mois minimum pour les emplois ou les apprentissages.</dd>
				<dt className="fr-text--bold">Quelles aides ?</dt>
				<dd>Aide dans la recherche d’emploi.</dd>
				<dd>Soutien financier pour passer un entretien à l’étranger, pour la prise en charge de frais tels que des cours
					de langue, la reconnaissance de leurs qualifications ou leur déménagement.
				</dd>
			</dl>
			</div>
		</CarteDispositif>
	);
}

function ErasmusCardContent() {
	return (
		<CarteDispositif lien={
			<Link
				className={classNameLienExterne}
				href="https://info.erasmusplus.fr/"
				aria-label="En savoir plus sur ERASMUS+ - nouvelle fenêtre">
				En savoir plus
			</Link>
		}>
			<h3 id="erasmus" className="fr-card__title">Le programme “ERASMUS+”</h3>
			<div className="fr-card__desc">
			<p>Entre 200 et 600 euros par mois selon le pays où vous effectuez votre mobilité d’études.</p>
			<dl>
				<dt className="fr-text--bold">Comment cela fonctionne ?</dt>
				<dd>Il vous donne la possibilité de séjourner à l’étranger pour renforcer vos compétences et accroître votre
					employabilité.
				</dd>
				<dt className="fr-text--bold">Pour qui ?</dt>
				<dd>Tout public</dd>
				<dt className="fr-text--bold">Pour quelle durée ?</dt>
				<dd>Étudiants : de 3 à 12 mois par cycle universitaire.</dd>
				<dd>Stage : de 2 à 12 mois.</dd>
				<dd>Formation professionnelle : de 1 à 360 jours.</dd>
				<dt className="fr-text--bold">Quelles aides ?</dt>
				<dd>
					Aides financières cumulables avec les bourses d’études, l’aide à la mobilité internationale (AMI) et les aides
					régionales/départementales et qui varient selon le type de mobilité et la destination :
					<ul>
						<li>Étudiants : entre 200 et 600 €/mois.</li>
						<li>Stage : entre 300 et 450 €/mois.</li>
						<li>Formation professionnelle : 32 à 43 €/jour selon le pays de mobilité pendant 2 semaines puis 22 à 30
							€/jour selon le pays de mobilité pour le reste de la mobilité.
						</li>
					</ul>
				</dd>
			</dl>
			</div>
		</CarteDispositif>
	);
}

function AidesFinancieresCardContent() {
	return (
		<Carte
			titreAs="h3"
			titre="Vous cherchez une aide financière pour vivre une expérience en Europe ?"
			footer={
				<Link className="fr-btn fr-btn--icon-right fr-icon-arrow-right-line" href="/mes-aides">
					Faire une simulation d’aides
				</Link>
			}>
			Découvrez le simulateur d’aides financières sur 1jeune1solution
		</Carte>
	);
}
