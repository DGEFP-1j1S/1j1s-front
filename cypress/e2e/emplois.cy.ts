/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import { toQueryString } from '../toQueryString';

import { Success } from '~/server/errors/either';
import { Offre, ResultatsRechercheOffre } from '~/server/offres/domain/offre';
import {
	getOffreRepositoryMockResults,
	searchOffreRepositoryMockResults,
} from '~/server/offres/infra/repositories/mockOffre.repository';

describe('Page de recherche d’emplois', () => {

	context('Parcours standard', () => {
		it('affiche 15 résultats par défaut', () => {
			const expectedResult = searchOffreRepositoryMockResults({ page: 1 }) as Success<ResultatsRechercheOffre>;

			cy.visit('/emplois');

      cy.contains('li', expectedResult.result.résultats[0].intitulé).parent('ul')
				.children()
				.should('have.length', expectedResult.result.résultats.length);
		});

		context('quand l‘utilisateur rentre un mot clé', () => {
			it('filtre les résultats par mot clé', () => {
				const expectedResult = searchOffreRepositoryMockResults({ motClé: 'barman', page: 1 }) as Success<ResultatsRechercheOffre>;

				cy.visit('/emplois');

				cy.findByRole('textbox', { name: /Métier, mot-clé/i }).type('barman');

				cy.findByRole('button', { name: /Rechercher/i }).click();

        cy.contains('li', expectedResult.result.résultats[0].intitulé).parent('ul')
					.children()
					.should('have.length', expectedResult.result.résultats.length);
			});
		});

		context('quand l‘utilisateur veut sélectionner la première offre', () => {
			it('navigue vers le détail de l‘offre', () => {
				const expectedResult = getOffreRepositoryMockResults() as Success<Offre>;

				cy.visit('/emplois');

        cy.contains('li', expectedResult.result.intitulé).parent('ul')
					.children()
					.first()
					.click();

				cy.findByRole('heading', { level: 1 }).should('contain.text', expectedResult.result.intitulé);
			});
		});
	});

	context('quand l’utilisateur arrive sur la page avec une recherche déjà renseignée', () => {
		it('rempli le formulaire avec la recherche', () => {
			const query = {
				codeLocalisation: '75',
				experienceExigence: 'E',
				grandDomaine: 'B',
				motCle: 'Informatique',
				nomLocalisation: 'Paris',
				tempsDeTravail: 'tempsPartiel',
				typeDeContrats: 'CDI',
				typeLocalisation: 'DEPARTEMENT',
			};

			cy.visit(`/emplois?${toQueryString(query)}`);

			cy.findByRole('textbox', { name: /Métier, Mot-clé/i }).should('have.value', query.motCle);
			cy.findByRole('combobox', { name: /Localisation/i }).should('have.value', `${query.nomLocalisation} (${query.codeLocalisation})`);

			cy.findByRole('button', { name: /Rechercher/i }).click();

      cy.get('li[role="option"]')
        .contains(/CDI/i)
        .should('have.attr', 'aria-selected', 'true')
      cy.findByRole('option', { name: /Temps partiel/i }).should('be.selected', true);
      cy.findByRole('option', { name: /Plus de 3 ans/i }).should('be.selected', true);
      cy.get('li[role="option"]')
        .contains(/Arts \/ Artisanat d‘art/i)
        .should('have.attr', 'aria-selected', 'true')
		});
	});

	context('quand les paramètres de l’url ne respectent pas le schema de validation du controller', () => {
		it('retourne une erreur de demande incorrecte', () => {
			cy.visit('/emplois?page=67', { failOnStatusCode: false });

			cy.findByText('Erreur - Demande incorrecte').should('exist');
		});
	});
});
