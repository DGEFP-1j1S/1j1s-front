import React from 'react';

import { ServiceCard } from './Card/ServiceCard';

export function MissionsLocalesPartner() {
	return (
		<ServiceCard
			title="Les missions locales proposent un suivi personnalisé pour tous les jeunes jusqu’à 25 ans"
			logo="/images/logos/union-mission-locale.svg"
			logoAlt="Union Nationale des Missions Locales, Représenter et accompagner les réseaux d’insertions"
			link="/articles/mission-locale"
			linkLabel="En savoir plus"
			titleAs={'h3'}>
			Les missions locales sont présentes sur l’ensemble du territoire national
			et permettent à tous les jeunes de 16 à 25 ans de surmonter les
			difficultés qui font obstacle à leur insertion professionnelle et sociale.
			Avec un accompagnement global pour les jeunes, elles traitent l’ensemble
			des difficultés d’insertion: emploi, formation, orientation, mobilité,
			logement, santé, accès à la culture et aux loisirs
		</ServiceCard>
	);
}
