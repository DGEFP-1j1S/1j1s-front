import { Image } from '~/client/components/ui/Img';

export default function Avantages() {
	return (
		<section className="fr-container">
			<div className="fr-grid-row fr-grid-row--gutters">
				<Image
					className="fr-col-12 fr-col-lg-6 fr-hidden fr-unhidden-lg"
					src="/illustrations/mentorat-employeur.svg"
					alt=""
					width={500}
					height={300}
				/>
				<div className="r-col-12 fr-col-lg-6">
					<h2>Les avantages</h2>
					<h3>Faites monter en compétences votre candidat</h3>
					<ul>
						<li>Formez votre candidat selon vos besoins</li>
						<li>Jusqu’à 400 heures de formation prises en charge par France Travail</li>
						<li>Faites votre demande en ligne et gérez vos demandes en cours</li>
						<li>Votre conseiller peut vous accompagner tout au long du montage de la demande d’aide</li>
						<li>Plus de 80% des entreprises sont satisfaites et recommandent ce dispositif</li>
					</ul>
				</div>
			</div>
		</section>
	);
}
