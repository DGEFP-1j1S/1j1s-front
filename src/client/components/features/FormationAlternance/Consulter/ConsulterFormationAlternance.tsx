import React from "react";
import { ConsulterOffreLayout } from '~/client/components/layouts/ConsulterOffre/ConsulterOffreLayout';
import { Link } from '~/client/components/ui/Link/Link';
import { Formation } from '~/server/formations/domain/formation';
import { Statistique } from '~/server/formations/domain/statistique';
import { StatistiquesFormationAlternance } from "./Statistiques/StatistiquesFormationAlternance";
import { BadgeList } from "~/client/components/ui/Badge/BadgeList";
import { Carte } from "~/client/dsfr";
import { ServiceCardList } from "~/client/components/features/ServiceCard/Card/ServiceCard";

export function ConsulterFormationAlternance({ formation, statistiques }: { formation: Formation, statistiques?: Statistique }) {
	const displayInformationCentreFormation = !!formation.adresse.adresseComplete;
	return (
		<>
			<ConsulterOffreLayout>
				<header className="fr-my-5w">
					<h1 className="fr-my-2w">{formation.titre}</h1>
					{formation.nomEntreprise && <p className="fr-h4">{formation.nomEntreprise}</p>}
					<BadgeList
						list={formation.tags}
						colorClass="fr-badge--blue-cumulus"
						aria-label="Caractéristiques de la mission" />
					{formation.lienDemandeRendezVous && (
						<Link
							href={formation.lienDemandeRendezVous}
							className="fr-btn fr-mt-2w">
							Contacter l’établissement
						</Link>
					)}
				</header>

				<section className="fr-mb-5w">
					{formationDetail("Description de la formation :", formation.description)}
					{formationDetail("Objectifs de la formation :", formation.objectif)}
					{formationDetail("Durée de la formation :", formation.dureeIndicative)}
					{displayInformationCentreFormation && (formationDetail("Informations sur le centre de formation :", formation.adresse.adresseComplete))}
				</section>
				<StatistiquesFormationAlternance statistiques={statistiques} />
			</ConsulterOffreLayout>
			<ServiceCardList>
				<Carte
					horizontal
					lien="/articles/inserjeunes"
					imageSrc="/images/logos/inserjeunes.svg"
					titre="Découvrez le dispositif InserJeunes">
					Inserjeunes est un service d’aide à l’orientation des jeunes qui présente différents indicateurs pour toutes les formations professionnelles.
				</Carte>
			</ServiceCardList>
		</>
	);
}

function formationDetail(titre: string, detail?: string) {
	return detail && (
			<>
				<h2 className="fr-h5">{titre}</h2>
				<p>{detail}</p>
			</>
		)
}
