import React from 'react';

import { ServiceCard } from './Card/ServiceCard';

export function CarifOrefPartner() {
	return (
		<ServiceCard
			linkLabel="Lire l’article"
			link="/articles/le-reseau-des-carif-oref-vous-accompagne"
			logo="/images/logos/carif-oref.svg"
			title="Besoin d’une formation qualifiante pour préparer votre entrée, votre maintien ou votre retour sur le marché du travail ? "
			titleAs={'h3'}>
			Notre partenaire Carif-Oref vous permet de trouver la formation qu’il vous faut en fonction de votre localisation,
			du type de métier auquel vous souhaitez être préparé, du niveau de qualification souhaité et bien plus encore !
		</ServiceCard>
	);
}
