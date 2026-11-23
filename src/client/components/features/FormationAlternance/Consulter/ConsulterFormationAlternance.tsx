import React from "react";
import { ConsulterOffreLayout } from '~/client/components/layouts/ConsulterOffre/ConsulterOffreLayout';
import { Link } from '~/client/components/ui/Link/Link';
import { Formation } from '~/server/formations/domain/formation';
import { Statistique } from '~/server/formations/domain/statistique';
import { BadgeList } from "~/client/components/ui/Badge/BadgeList";

import {
	StatistiquesFormationAlternance,
} from './Statistiques/StatistiquesFormationAlternance';

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
					{formation.description && (
						<>
							<h2 className="fr-h5">Description de la formation :</h2>
							<p>{formation.description}</p>
						</>
					)}
					{formation.objectif && (
						<>
							<h2 className="fr-h5">Objectifs de la formation :</h2>
							<p>{formation.objectif}</p>
						</>
					)}
					{formation.dureeIndicative && (
						<>
							<h2 className="fr-h5">Durée de la formation :</h2>
							<p>{formation.dureeIndicative}</p>
						</>
					)}
					{displayInformationCentreFormation && (
						<>
							<h2 className="fr-h5">Informations sur le centre de formation :</h2>
							{formation.adresse.adresseComplete &&
								<p>Adresse : {formation.adresse.adresseComplete}</p>
							}
						</>
					)}
				</section>
			</ConsulterOffreLayout>
			<StatistiquesFormationAlternance statistiques={statistiques} />
		</>
	);
}
