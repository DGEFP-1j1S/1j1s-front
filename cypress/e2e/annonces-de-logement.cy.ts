/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import emptyLogementResponse from '../fixture/annonces/emptyLogementMeilisearchResponse.fixture.json';
import logementFiltreeResponse from '../fixture/annonces/logementFiltreeMeilisearchResponse.fixture.json';
import logementNonFiltreeResponse from '../fixture/annonces/logementNonfiltreeMeilisearchResponse.fixture.json';

function visiterLesAnnonces(reponseMeilisearch: object) {
	cy.task('choisirReponseMeilisearch', reponseMeilisearch);
	cy.visit('/logements/annonces');
}

describe('Parcours logement', () => {
	beforeEach(() => {
		cy.viewport('iphone-x');
	});

	context('quand on arrive sur la page des annonces de logement', () => {
		describe('quand il y a des annonces', () => {
			it("affiche le résultat du nombre d'annonces de logements", () => {
				visiterLesAnnonces(logementNonFiltreeResponse);

				cy.findByRole('heading', { level: 2, name: /4 annonces pour étudiants/ });
			});

			it("affiche une liste d'annonces de logement par défaut", () => {
				visiterLesAnnonces(logementNonFiltreeResponse);

				cy.findByRole('list', { name: 'Annonces de logement' })
					.children('li')
					.should('have.length', 4);
			});
		});

		describe('quand on fait une recherche par ville', () => {
			it("filtre le nombre d'annonces", () => {
				visiterLesAnnonces(logementNonFiltreeResponse);

				cy.findByRole('textbox', { name: /Ville/ }).type('par');
				cy.task('choisirReponseMeilisearch', logementFiltreeResponse);
				cy.findByRole('button', { name: 'Rechercher' }).click();

				cy.location('search').should('contain', 'ville=par');
				cy.findByRole('list', { name: 'Annonces de logement' })
					.children('li')
					.should('have.length', 2);
			});
		});

		describe("quand il n'y a pas d'annonces", () => {
			it("affiche un message d'erreur avec 0 résultats", () => {
				visiterLesAnnonces(emptyLogementResponse);

				cy.findByText('0 résultat').should('be.visible');
			});
		});
	});
});
