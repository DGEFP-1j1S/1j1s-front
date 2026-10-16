import { Link } from '~/client/components/ui/Link/Link';

import styles from '../EmploiEnEuropeContent.module.scss';

export function Dispositifs() {
	return (
		<section className={styles.dispositifs}>
			<h2>Je découvre les dispositifs pour m’accompagner dans mon projet</h2>
			<ul className={styles.cards} aria-label="Dispositifs d'accompagnement">
				<li><EuresCardContent /></li>
				<li className={styles.erasmus}><ErasmusCardContent /></li>
				<li><AidesFinancieresCardContent /></li>
			</ul>
		</section>
	);
}

function EuresCardContent() {
	return (
		<>
			<h3 id="eures">Le programme de mobilité ciblé EURES</h3>
			<dl>
				<dt>Comment cela fonctionne ?</dt>
				<dd>Il vous aide à trouver un emploi, une formation ou un apprentissage dans un autre État membre de l’Union
					européenne.
				</dd>
				<dt>Pour qui ?</dt>
				<dd>Tout demandeur d’emploi de plus de 18 ans ; indépendamment de ses qualifications.</dd>
				<dt>Pour quelle durée ?</dt>
				<dd>Contrat de 3 mois minimum pour les stages</dd>
				<dd>Contrat de 6 mois minimum pour les emplois ou les apprentissages.</dd>
				<dt>Quelles aides ?</dt>
				<dd>Aide dans la recherche d’emploi.</dd>
				<dd>Soutien financier pour passer un entretien à l’étranger, pour la prise en charge de frais tels que des cours
					de langue, la reconnaissance de leurs qualifications ou leur déménagement.
				</dd>
			</dl>
			<Link
				appearance="asPrimaryButton"
				href="https://eures.europa.eu/index_fr"
				aria-label="En savoir plus sur EURES - nouvelle fenêtre">
				En savoir plus
				<Link.Icon />
			</Link>
		</>
	);
}

function ErasmusCardContent() {
	return (
		<>
			<h3 id="erasmus">Le programme “ERASMUS+”</h3>
			<p>Entre 200 et 600 euros par mois selon le pays où vous effectuez votre mobilité d’études.</p>
			<dl>
				<dt>Comment cela fonctionne ?</dt>
				<dd>Il vous donne la possibilité de séjourner à l’étranger pour renforcer vos compétences et accroître votre
					employabilité.
				</dd>
				<dt>Pour qui ?</dt>
				<dd>Tout public</dd>
				<dt>Pour quelle durée ?</dt>
				<dd>Étudiants : de 3 à 12 mois par cycle universitaire.</dd>
				<dd>Stage : de 2 à 12 mois.</dd>
				<dd>Formation professionnelle : de 1 à 360 jours.</dd>
				<dt>Quelles aides ?</dt>
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
			<Link
				appearance="asPrimaryButton"
				href="https://info.erasmusplus.fr/"
				aria-label="En savoir plus sur ERASMUS+ - nouvelle fenêtre">
				En savoir plus
				<Link.Icon />
			</Link>
		</>
	);
}

function AidesFinancieresCardContent() {
	return (
		<>
			<h3 id="aides-financieres">Vous cherchez une aide financière pour vivre une expérience en Europe ?</h3>
			<p>Découvrez le simulateur d’aides financières sur 1jeune1solution</p>
			<Link appearance="asPrimaryButton" href="/mes-aides">
				Faire une simulation d’aides
				<Link.Icon />
			</Link>
		</>
	);
}
