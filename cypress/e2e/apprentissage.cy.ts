/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import { stringify } from 'querystring';

import { anAlternanceFiltre } from '~/server/alternances/domain/alternance.fixture';
import {
	mockedRepositoryReturnsASuccessWhenCodeCommuneIsNot12345,
} from '~/server/alternances/infra/repositories/mockAlternance.repository';
import { aMetier } from '~/server/metiers/domain/metierAlternance.fixture';

const aQuery = {
	codeCommune: '75056',
	codePostal: '75001',
	codeRomes: 'D1102,D1104',
	distanceCommune: '10',
	latitudeCommune: '48.859',
	libelleMetier: 'Boulangerie, pâtisserie, chocolaterie',
	longitudeCommune: '2.347',
	ville: 'Paris',
};

// NOTE : suite désactivée suite à la bascule vers les landings LBA (308 cross-origin).
// Le fichier sera supprimé par le PR enabler de nettoyage code mort.
describe.skip('Parcours alternance LBA', () => {
	beforeEach(() => {
		cy.viewport('iphone-x');
	});

	it('ne fait pas de recherche par défaut', () => {
		cy.visit('/apprentissage');
		cy.findByRole('list', { name: /Offres d’alternances/i }).should('not.exist');
	});

	describe('Quand l’utilisateur cherche un métier', () => {
		it('tous les métiers sont accessibles mais au maximum 10 sont visibles sans scroll', () => {
			const listeMetiers = new Array(11).fill(aMetier());

			cy.visit('/apprentissage');
			cy.intercept(
				'GET',
				'/api/metiers*',
				JSON.stringify(listeMetiers),
			).as('recherche-mot-cle-alternances');

			cy.findByRole('combobox', { name: /Domaine/i }).type('travaux');
			cy.wait('@recherche-mot-cle-alternances');

			cy.findAllByRole('option').should('have.length', 11);
			cy.findAllByRole('option').first().should('be.visible');
			cy.findAllByRole('option').last().should('not.be.visible');
		});
	});

	describe('Quand l’utilisateur effectue une recherche', () => {
		it('affiche les résultats', () => {
			const filtre = anAlternanceFiltre({
				codeCommune: '75056',
				codeRomes: ['D1102', 'D1104'],
				distanceCommune: '10',
				latitudeCommune: '48.859',
				longitudeCommune: '2.347',
			});
			const query = {
				codeCommune: '75056',
				codePostal: '75001',
				codeRomes: 'D1102,D1104',
				distanceCommune: '10',
				latitudeCommune: '48.859',
				libelleMetier: 'Boulangerie, pâtisserie, chocolaterie',
				longitudeCommune: '2.347',
				ville: 'Paris',
			};
			const expectedResult = mockedRepositoryReturnsASuccessWhenCodeCommuneIsNot12345(filtre);

			cy.visit(`/apprentissage?${stringify(query)}`);

			cy.findByRole('list', { name: /Offres d’alternances/i })
				.children()
				.should('have.length', expectedResult?.result.offreList.length);
		});
	});

	describe('quand la recherche retourne une erreur', () => {
		it('affiche l’erreur', () => {
			// NOTE (DORO 02-02-2024): Query qui génère une erreur dans le repository mocké
			const query = {
				...aQuery,
				codeCommune: '12345',
			};

			cy.visit(`/apprentissage?${stringify(query)}`, { failOnStatusCode: false });

			cy.findByText(/Service Indisponible/i).should('be.visible');
		});
	});
});

