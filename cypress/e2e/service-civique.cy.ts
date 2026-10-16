/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import { aRésultatRechercheMission } from '~/server/engagement/domain/missionEngagement.fixture';
import { aCommune } from '~/server/localisations/domain/localisationAvecCoordonnées.fixture';

context('Parcours service civique', () => {
	beforeEach(() => {
		cy.viewport('iphone-x');
	});

	context('quand l‘utilisateur choisi un domaine', () => {
		beforeEach(() => {
			cy.visit('/service-civique');
		});
		it('affiche la liste des résultats', () => {
			cy.findByRole('combobox', { name: 'Domaine Exemple : Culture et loisirs' }).click();
			cy.findAllByRole('option').first().click();

			cy.intercept(
				'GET',
				'/api/communes*',
				JSON.stringify({
					résultats: [aCommune({
						code: '75056',
						codePostal: '75006',
						coordonnées: { latitude: 48.859, longitude: 2.347 },
						libelle: 'Paris (75006)',
						ville: 'Paris',
					})],
				}),
			).as('recherche-communes');

			cy.findByRole('combobox', { name: /Localisation/i }).type('paris');
			cy.wait('@recherche-communes');

			cy.findAllByRole('option').first().click();

			cy.intercept('GET', '/api/services-civique*', JSON.stringify(aRésultatRechercheMission()))
				.as('recherche-services-civique');

			cy.findByRole('button', { name: /Rechercher/i }).click();
			cy.wait('@recherche-services-civique');

			cy.findByRole('list', { name: /Offre pour le service civique/i }).children().should('have.length', 2);
			cy.findByRole('list', { name: /Offre pour le service civique/i })
				.children()
				.first()
				.should('contain.text', 'Je distribue des produits de première nécessité et des repas aux plus démunis, dans la rue ou au sein d’établissements dédiés');
		});
	});

	context('quand l‘utilisateur clique sur le premier élément de la liste', () => {
		beforeEach(() => {
			cy.visit('/service-civique?domain=culture-loisirs&codeCommune=75056&latitudeCommune=48.859&longitudeCommune=2.347&distanceCommune=10&page=1');
		});
		it('navigue vers le détail de l‘offre', () => {
			cy.intercept('GET', '/api/services-civique*', JSON.stringify(aRésultatRechercheMission()))
				.as('recherche-services-civique');

			cy.findByRole('button', { name: /Rechercher/i }).click();
			cy.wait('@recherche-services-civique');

			const id = aRésultatRechercheMission().résultats[0].id;

			cy.intercept('GET',
				`/_next/data/*/service-civique/${id}.json?id=${id}`,
				JSON.stringify({ pageProps: { missionEngagement: aRésultatRechercheMission().résultats[0] } }))
				.as('get-services-civique');

			cy.findByRole('list', { name: /Offre pour le service civique/i }).children().first()
				.within(() => cy.findByRole('link', { name: /En savoir plus/i }).click());
			cy.wait('@get-services-civique');

			cy.findByRole('heading', { level: 1 })
				.should('contain.text', 'Je distribue des produits de première nécessité et des repas aux plus démunis, dans la rue ou au sein d’établissements dédiés');
			cy.findByRole('list', { name: /Caractéristiques de la mission/i }).should('be.visible');
		});
	});
});
