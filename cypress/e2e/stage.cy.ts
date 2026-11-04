/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import stageNonFiltreeResponse from '../fixture/annonces/stageNonFiltreeMeilisearcheResponse.fixture.json';

describe('Recherche de stages', () => {
	beforeEach(() => {
		cy.viewport('iphone-x');
		cy.task('choisirReponseMeilisearch', stageNonFiltreeResponse);
		cy.visit('/stages');
	});

	context('quand on arrive sur la page de recherche de stages', () => {
		describe('quand on fait une recherche par domaines', () => {
			it('affiche les domaines par ordre alphabétique avec non renseigné en dernier element', () => {
				cy.findByRole('combobox', { name: /Domaines/i }).click();

				cy.findAllByRole('option').first().should('contain.text', 'Achats');
				cy.findAllByRole('option').eq(1).should('contain.text', 'Production');
				cy.findAllByRole('option').eq(2).should('contain.text', 'Travaux');
				cy.findAllByRole('option').last().should('contain.text', 'Non renseigné');
			});
		});
	});
});
