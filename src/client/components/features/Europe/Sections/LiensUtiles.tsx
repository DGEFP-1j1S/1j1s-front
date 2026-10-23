import { Tuile } from "~/client/dsfr";

export function LiensUtiles() {
	return (
		<section className="fr-container fr-py-5w">
			<h2 className="fr-h3">Découvrez d’autres services destinés à vous aider à trouver l’expérience en Europe faite pour vous :</h2>
			<ul className="fr-grid-row fr-grid-row--gutters list-style-none fr-pl-0" aria-label="liens utiles">
				<li className="fr-col-12 fr-col-md-4">
					<Tuile
						lien="https://www.euroappmobility.eu/fr/"
						titre="Vous souhaitez faire une partie de votre apprentissage en Europe" />
				</li>
				<li className="fr-col-12 fr-col-md-4">
					<Tuile
						lien="https://mon-vie-via.businessfrance.fr/"
						titre={
							<>Vous cherchez un Volontariat International (<abbr
								title="Volontariat International en Entreprise">V.I.E</abbr> / <abbr
								title="Volontariat International en Administration">V.I.A</abbr>)</>
						} />
				</li>
				<li className="fr-col-12 fr-col-md-4">
					<Tuile
						lien="https://europa.eu/youth/solidarity/young-people/volunteering_fr"
						titre="Vous souhaitez vous engager dans une mission de solidarité en Europe" />
				</li>
			</ul>
		</section>
	);
}
