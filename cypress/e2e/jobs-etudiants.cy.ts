/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import { stringify } from 'querystring';

import { Success } from '~/server/errors/either';
import { Offre, RésultatsRechercheOffre } from '~/server/offres/domain/offre';
import {
	getOffreRepositoryMockResults,
	searchOffreRepositoryMockResults,
} from '~/server/offres/infra/repositories/mockOffre.repository';

describe('Page de recherche d’emplois', () => {
	beforeEach(() => {
		cy.viewport('iphone-x');
	});

	context('Parcours standard', () => {
		it('affiche 15 résultats par défaut', () => {
			const expectedResult = searchOffreRepositoryMockResults({ page: 1 }) as Success<RésultatsRechercheOffre>;

			cy.visit('/jobs-etudiants');

			cy.findByRole('list', { name: /Offres de jobs étudiants/i })
				.children()
				.should('have.length', expectedResult.result.résultats.length);
			cy.findByRole('list', { name: /Offres de jobs étudiants/i })
				.children()
				.first()
				.should('contain.text', expectedResult.result.résultats[0].intitulé);
		});

		context('quand l‘utilisateur rentre un mot clé', () => {
			it('filtre les résultats par mot clé', () => {
				const expectedResult = searchOffreRepositoryMockResults({ motClé: 'barman', page: 1 }) as Success<RésultatsRechercheOffre>;

				cy.visit('/jobs-etudiants');

				cy.findByRole('textbox', { name: /Métier, mot-clé/i }).type('barman');

				cy.findByRole('button', { name: /Rechercher/i }).click();

				cy.findByRole('list', { name: /Offres de jobs étudiants/i })
					.children()
					.should('have.length', expectedResult.result.résultats.length);
			});
		});

		context('quand l‘utilisateur veut sélectionner la première offre', () => {
			it('navigue vers le détail de l‘offre', () => {
				const expectedResult = getOffreRepositoryMockResults() as Success<Offre>;

				cy.visit('/jobs-etudiants');

				cy.findByRole('list', { name: /Offres de jobs étudiants/i })
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

			cy.visit(`/jobs-etudiants?${stringify(query)}`);

			cy.findByRole('textbox', { name: /Métier, Mot-clé/i }).should('have.value', query.motCle);
			cy.findByRole('combobox', { name: /Localisation/i }).should('have.value', `${query.nomLocalisation} (${query.codeLocalisation})`);
		});
	});

	context('quand les paramètres de l’url ne respectent pas le schema de validation du controller', () => {
		it('retourne une erreur de demande incorrecte', () => {
			cy.visit('/jobs-etudiants?page=67', { failOnStatusCode: false });

			cy.findByText('Erreur - Demande incorrecte').should('exist');
		});
	});
});

