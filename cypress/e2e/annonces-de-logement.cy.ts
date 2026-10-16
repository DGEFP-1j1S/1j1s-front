/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import emptyLogementResponse from '../fixture/annonces/emptyLogementMeilisearchResponse.fixture.json';
import logementFiltreeResponse from '../fixture/annonces/logementFiltreeMeilisearchResponse.fixture.json';
import logementNonFiltreeResponse from '../fixture/annonces/logementNonfiltreeMeilisearchResponse.fixture.json';

describe('Parcours logement', () => {
	beforeEach(() => {
		cy.viewport('iphone-x');
		cy.visit('/logements/annonces');
	});

	context('quand on arrive sur la page des annonces de logement', () => {
		describe('quand il y a des annonces', () => {
	  it("affiche le résultat du nombre d'annonces de logements", () => {
				cy.intercept({ method: 'POST', pathname: '/multi-search' }, logementNonFiltreeResponse);

				cy.findByRole('heading', { level: 2, name: /4 annonces pour étudiants/ });
	  });

	  it("affiche une liste d'annonces de logement par défaut", () => {
				cy.intercept({ method: 'POST', pathname: '/multi-search' }, logementNonFiltreeResponse);

				// FIXME (GAFI 23-05-2023): Manque un label sur la liste de résultats
				cy.get('ol > li').should('have.length', 4);
	  });
		});

		describe('quand on fait une recherche par ville', () => {
	  it("filtre le nombre d'annonces", () => {
				cy.intercept({ pathname: '/multi-search' }, logementNonFiltreeResponse);
				cy.intercept({ pathname: '/multi-search' }, logementFiltreeResponse);

				cy.findByRole('textbox', { name: 'Ville' }).type('par');

				cy.get('ol > li').should('have.length', 2);
	  });
		});

		describe("quand il n'y a pas d'annonces", () => {
	  it("affiche un message d'erreur avec 0 résultats", () => {
				cy.intercept({ pathname: '/multi-search' }, emptyLogementResponse).as('searchLogements');
				cy.wait('@searchLogements');

				cy.findByText('0 résultat').should('be.visible');
	  });
  	});
	});
});
