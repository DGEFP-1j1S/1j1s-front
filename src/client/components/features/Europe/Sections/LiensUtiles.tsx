import { Link } from '~/client/components/ui/Link/Link';

import styles from '../EmploiEnEuropeContent.module.scss';

export function LiensUtiles() {
	return (
		<section className={styles.liensUtiles}>
			<h2>Découvrez d’autres services destinés à vous aider à trouver l’expérience en Europe faite pour vous :</h2>
			<ul aria-label="liens utiles">
				<li>
					<Link appearance="asQuaternaryButton" href="https://www.euroappmobility.eu/fr/">
						Vous souhaitez faire une partie de votre apprentissage en Europe
						<Link.Icon />
					</Link>
				</li>
				<li>
					<Link appearance="asQuaternaryButton" href="https://mon-vie-via.businessfrance.fr/">
						<span>Vous cherchez un Volontariat International (<abbr
							title="Volontariat International en Entreprise">V.I.E</abbr> / <abbr
							title="Volontariat International en Administration">V.I.A</abbr>)</span>
						<Link.Icon />
					</Link>
				</li>
				<li>
					<Link appearance="asQuaternaryButton" href="https://europa.eu/youth/solidarity/young-people/volunteering_fr">
						Vous souhaitez vous engager dans une mission de solidarité en Europe
						<Link.Icon />
					</Link>
				</li>
			</ul>
		</section>
	);
}
