/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import { aRésultatRechercheMission } from '~/server/engagement/domain/missionEngagement.fixture';
import { aCommune } from '~/server/localisations/domain/localisationAvecCoordonnées.fixture';

describe('Parcours bénévolat', () => {

	context('quand l‘utilisateur choisi un domaine', () => {
		beforeEach(() => {
			cy.viewport('iphone-x');
			cy.visit('/benevolat');
		});
		it('affiche la liste des résultats', () => {
			cy.findByRole('combobox', { name: 'Domaine Exemple : Culture et loisirs' }).click();
			cy.findAllByRole('option').first().click();

			cy.intercept(
				'GET',
				'/api/communes*',
				JSON.stringify({
					résultats: [
						aCommune(),
					],
				}),
			).as('recherche-communes');

			cy.findByRole('combobox', { name: /Localisation/i }).type('paris');
			cy.wait('@recherche-communes');

			cy.findAllByRole('option').first().click();
			cy.intercept(
				'GET',
				'/api/benevolats*',
				JSON.stringify(aRésultatRechercheMission()),
			).as('recherche-api-benevolats');

			cy.findByRole('button', { name: /Rechercher/i }).click();
			cy.wait('@recherche-api-benevolats');

			cy.findByRole('list', { name: /Offre pour le bénévolat/i }).children().should('have.length', 2);
		});
	});

	context('quand l‘utilisateur clique sur le premier élément de la liste', () => {
		beforeEach(() => {
			cy.viewport('iphone-x');
			cy.visit('/benevolat?domain=culture-loisirs&codeCommune=75056&latitudeCommune=48.859&longitudeCommune=2.347&distanceCommune=10&page=1');
		});
		it('navigue vers le détail de l‘offre', () => {
			const id = aRésultatRechercheMission().résultats[0].id;

			cy.intercept(
				'GET',
				'/api/benevolats*',
				JSON.stringify(aRésultatRechercheMission()),
			).as('recherche-api-benevolats');

			cy.findByRole('button', { name: /Rechercher/i }).click();
			cy.wait('@recherche-api-benevolats');

			cy.intercept(
				'GET',
				`/_next/data/*/benevolat/${id}.json?id=${id}`,
				JSON.stringify({ pageProps: { missionEngagement: aRésultatRechercheMission().résultats[0] } }),
			).as('get-benevolat');

			cy.findByRole('list', { name: /Offre pour le bénévolat/i }).children().first().click();
			cy.wait('@get-benevolat');

			cy.findByRole('heading', { level: 1 }).should('be.visible');
			cy.findByRole('list', { name: /Caractéristiques de la mission/i }).should('be.visible');
		});
	});
});
