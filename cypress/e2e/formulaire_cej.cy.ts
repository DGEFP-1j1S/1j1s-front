/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import { interceptPost } from '../interceptPost';

describe('Parcours formulaire cej', () => {
	beforeEach(() => {
		cy.viewport('iphone-x');
		cy.visit('/contrat-engagement-jeune');
	});

	context('quand l’utilisateur correctement remplie le formulaire', () => {
		it('clique sur le bouton qui affiche le formulaire de contact', () => {
			// FIXME (GAFI 23-10-2023): Mauvais point, ça devrait être un point médian
			cy.findByRole('button', { name: /Demander à être contacté\.e/i }).click();
			cy.findByRole('heading', {
				// FIXME (GAFI 23-10-2023): deuxième titre de niveau 1 sur la page ...
				level: 1,
				name: /J‘ai des questions sur le Contrat d‘Engagement Jeune et souhaite être rappelé/i,
			}).should('be.visible');
		});

		it('affiche un message de succès', () => {
			cy.findByRole('button', { name: /Demander à être contacté\.e/i }).click();

			cy.findByRole('textbox', { name: /Prénom/i }).type('jean');
			// FIXME (BRUJ 22/11/2023): test flaky obligé de rajouter un force
			cy.findByRole('textbox', { name: /Nom/ }).type('dupont', { force: true });
			cy.findByRole('textbox', { name: /Adresse e-mail/i }).type('jean.dupont@mail.com');
			cy.findByRole('textbox', { name: /Téléphone/i }).type('0688552233');
			// FIXME (GAFI 23-10-2023): Manque un circonflèxe par ici ...
			cy.findByRole('combobox', { name: 'Age Exemple : 16 ans' }).click();
			cy.findAllByRole('option').first().click();

			cy.intercept(
				'/api/communes*',
				JSON.stringify({
					résultats: [
						{
							code: '75056',
							codePostal: '75006',
							coordonnées: {
								latitude: 48.859,
								longitude: 2.347,
							},
							libelle: 'Paris (75006)',
							ville: 'Paris',
						},
					],
				}),
			).as('get-communes');
			cy.findByRole('combobox', { name: /Ville/i }).type('paris');
			cy.findByRole('option', { name: 'Paris (75006)' }).click();

			interceptPost(
				{
					actionBeforeWaitTheCall: () => cy.findByRole('button', { name: /Envoyer la demande/i }).click(),
					alias: 'submit-form',
					path: '/api/demandes-de-contact',
					response: JSON.stringify({
						statusCode: 201,
					}),
					responseBodyToCheck: {
						age: 16,
						codePostal: '75006',
						email: 'jean.dupont@mail.com',
						nom: 'dupont',
						prénom: 'jean',
						type: 'CEJ',
						téléphone: '0688552233',
						ville: 'Paris',
					},
				},
			);

			cy.findByText('Votre demande a bien été transmise !').should('be.visible');
		});
	});

	context('quand l‘utilisateur rempli le champ email avec un email qui ne correspond pas à la regex', () => {
		// NOTE (BRUJ 30/05/2024): Ce test permet de verifier que la regex d'email est bien fonctionelle en tant que pattern d'un input
		it('le champ est invalide et le formulaire n‘est pas envoyé', () => {
			cy.findByRole('button', { name: /Demander à être contacté\.e/i }).click();

			cy.findByRole('textbox', { name: /Prénom/i }).type('jean');
			cy.findByRole('textbox', { name: /Nom/ }).type('dupont', { force: true });
			cy.findByRole('textbox', { name: /Adresse e-mail/i }).type('mauvais-email@123ab.com');
			cy.findByRole('textbox', { name: /Téléphone/i }).type('0688552233');
			cy.findByRole('combobox', { name: 'Age Exemple : 16 ans' }).click();
			cy.findAllByRole('option').first().click();
			cy.findByRole('combobox', { name: /Ville/i }).type('paris');
			cy.intercept(
				'/api/communes*',
				JSON.stringify({
					résultats: [
						{
							code: '75056',
							codePostal: '75006',
							coordonnées: {
								latitude: 48.859,
								longitude: 2.347,
							},
							libelle: 'Paris (75006)',
							ville: 'Paris',
						},
					],
				}),
			).as('get-communes');
			cy.findByRole('option', { name: 'Paris (75006)' }).click();

			cy.findByRole('button', { name: /Envoyer la demande/i }).click();


			cy.findByRole('textbox', { name: /Adresse e-mail/i }).should('match', ':invalid');
		});
	});
});
