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

			cy.visit('/emplois');

			cy.findByRole('list', { name: /Offres d‘emplois/i })
				.children()
				.should('have.length', expectedResult.result.résultats.length);
			cy.findByRole('list', { name: /Offres d‘emplois/i })
				.children()
				.first()
				.should('contain.text', expectedResult.result.résultats[0].intitulé);
		});

		context('quand l‘utilisateur rentre un mot clé', () => {
			it('filtre les résultats par mot clé', () => {
				const expectedResult = searchOffreRepositoryMockResults({ motClé: 'barman', page: 1 }) as Success<RésultatsRechercheOffre>;

				cy.visit('/emplois');

				cy.findByRole('textbox', { name: /Métier, mot-clé/i }).type('barman');

				cy.findByRole('button', { name: /Rechercher/i }).click();

				cy.findByRole('list', { name: /Offres d‘emplois/i })
					.children()
					.should('have.length', expectedResult.result.résultats.length);
			});
		});

		context('quand l‘utilisateur veut sélectionner la première offre', () => {
			it('navigue vers le détail de l‘offre', () => {
				const expectedResult = getOffreRepositoryMockResults() as Success<Offre>;

				cy.visit('/emplois');

				cy.findByRole('list', { name: /Offres d‘emplois/i })
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

			cy.visit(`/emplois?${stringify(query)}`);

			cy.findByRole('textbox', { name: /Métier, Mot-clé/i }).should('have.value', query.motCle);
			cy.findByRole('combobox', { name: /Localisation/i }).should('have.value', `${query.nomLocalisation} (${query.codeLocalisation})`);

			cy.findByRole('button', { name: /Filtrer ma recherche/i }).click();

			cy.findByRole('checkbox', { name: /Contrat à durée indéterminé/i }).should('be.checked');
			cy.findByText(summary(/Temps de travail/i)).click();
			cy.findByRole('radio', { name: /Temps partiel/i }).should('be.checked');
			cy.findByText(summary(/Niveau demandé/i)).click();
			cy.findByRole('radio', { name: /Plus de 3 ans/i }).should('be.checked');
			cy.findByText(summary(/Domaine/i)).click();
			cy.findByRole('checkbox', { name: /Arts \/ Artisanat d‘art/i }).should('be.checked');
		});
	});

	context('quand les paramètres de l’url ne respectent pas le schema de validation du controller', () => {
		it('retourne une erreur de demande incorrecte', () => {
			cy.visit('/emplois?page=67', { failOnStatusCode: false });

			cy.findByText('Erreur - Demande incorrecte').should('exist');
		});
	});
});

// NOTE (GAFI 08-08-2023): summary n'a pas de role mais est intéractif :(
//	cf. https://w3c.github.io/html-aria/#el-summary
function summary(expectedContent: string | RegExp) {
	return function summary(content: string, element: Element | null): boolean {
		return Boolean(element?.tagName === 'SUMMARY' && content.match(expectedContent));
	};
}
