import React from 'react';

import { Carte } from '~/client/dsfr';

export function MissionsLocalesPartner() {
	return (
		<Carte
			horizontal
			titre="Les missions locales proposent un suivi personnalisé pour tous les jeunes jusqu'à 25 ans"
			imageSrc="/images/logos/union-mission-locale.svg"
			imageAlt="Union Nationale des Missions Locales, Représenter et accompagner les réseaux d'insertions"
			lien="/articles/mission-locale">
			Les missions locales sont présentes sur l’ensemble du territoire national
			et permettent à tous les jeunes de 16 à 25 ans de surmonter les
			difficultés qui font obstacle à leur insertion professionnelle et sociale.
			Avec un accompagnement global pour les jeunes, elles traitent l’ensemble
			des difficultés d’insertion: emploi, formation, orientation, mobilité,
			logement, santé, accès à la culture et aux loisirs
		</Carte>
	);
}
