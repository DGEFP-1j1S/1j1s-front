/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
import {
	aFormulaireEnvoyePostedValue,
	aFormulaireEtapeEntreprise,
	aFormulaireEtapeLocalisation,
	aFormulaireEtapeStage,
} from '../../src/client/components/features/OffreDeStage/Déposer/StageDeposerOffre.fixture';
import { interceptPost } from '../interceptPost';

const FORMULAIRE_ETAPE_1_LABEL = 'formulaireEtape1';
const FORMULAIRE_ETAPE_2_LABEL = 'formulaireEtape2';

describe('Dépôt de Stage', () => {
	beforeEach(() => {
		cy.clearAllSessionStorage();
		cy.clearAllLocalStorage();
	});

	describe('quand l’utilisateur arrive sur la page de l’étape 1', () => {
		beforeEach(() => {
			cy.visit('/je-recrute');
			cy.findByRole('link', { name: /Déposer une offre de stage/i }).click();
		});
		describe('et qu‘il remplit le formulaire de l’étape 1', () => {
			it('le redirige vers l’étape 2', () => {
				cy.findByRole('textbox', { name: /Nom de l’entreprise ou de l’employeur/i }).type(aFormulaireEtapeEntreprise().nomEmployeur);
				cy.findByRole('textbox', { name: /Adresse mail de contact/i }).type(aFormulaireEtapeEntreprise().emailEmployeur);
				cy.findByRole('textbox', { name: /Courte description de l’entreprise/i }).type(aFormulaireEtapeEntreprise().descriptionEmployeur);
				cy.findByRole('button', { name: /Suivant/i }).click();

				cy.title().should('contain', 'Étape 2 sur 3');
				cy.url().should('include', '/stages/deposer-offre/votre-offre-de-stage');
			});
		});
	});

	describe('quand l’utilisateur arrive sur la page de l’étape 2', () => {
		describe('et qu’il n’a pas rempli l’étape 1', () => {
			it('redirige vers l’étape 1', () => {
				cy.visit('/stages/deposer-offre/votre-offre-de-stage');

				cy.title().should('contain', 'Étape 1 sur 3');
				cy.url().should('include', '/stages/deposer-offre');
				cy.url().should('not.include', 'votre-offre-de-stage');
			});
		});

		describe('et qu‘il remplit le formulaire', () => {
			// NOTE (BRUJ 30/05/2024): Ce test permet de verifier que la regex url et email est bien fonctionelle en tant que pattern d'un input
			it('avec une url/email de candidature invalide, ne peut pas aller à l‘étape 3', () => {
				cy.visit('/stages/deposer-offre/votre-offre-de-stage', {
					onBeforeLoad(win: Cypress.AUTWindow) {
						win.localStorage.setItem(FORMULAIRE_ETAPE_1_LABEL, JSON.stringify(aFormulaireEtapeEntreprise()));
					},
				});

				cy.findByRole('textbox', { name: /Nom de l’offre de stage/i }).type(aFormulaireEtapeStage().nomOffre);
				cy.findByRole('textbox', { name: /Lien sur lequel les candidats pourront postuler/i }).type('mauvaisemail');
				cy.findByRole('textbox', { name: /Description de l’offre de stage/i }).type(aFormulaireEtapeStage().descriptionOffre);
				cy.findByLabelText(/^Date précise du début de stage/i).type(aFormulaireEtapeStage().dateDeDebutMin);
				cy.findByRole('combobox', { name: 'Durée du stage Exemple : 3 mois' }).click();
				cy.findAllByRole('option').first().click();

				cy.findByRole('textbox', { name: /Lien sur lequel les candidats pourront postuler/i }).should('match', ':invalid');
			});
			it('le redirige vers l’étape 3', () => {
				cy.visit('/stages/deposer-offre/votre-offre-de-stage', {
					onBeforeLoad(win: Cypress.AUTWindow) {
						win.localStorage.setItem(FORMULAIRE_ETAPE_1_LABEL, JSON.stringify(aFormulaireEtapeEntreprise()));
					},
				});

				cy.findByRole('textbox', { name: /Nom de l’offre de stage/i }).type(aFormulaireEtapeStage().nomOffre);
				cy.findByRole('textbox', { name: /Lien sur lequel les candidats pourront postuler/i }).type(aFormulaireEtapeStage().lienCandidature);
				cy.findByRole('textbox', { name: /Description de l’offre de stage/i }).type(aFormulaireEtapeStage().descriptionOffre);
				cy.findByLabelText(/^Date précise du début de stage/i).type(aFormulaireEtapeStage().dateDeDebutMin);
				cy.findByRole('combobox', { name: 'Durée du stage Exemple : 3 mois' }).click();
				cy.findAllByRole('option').first().click();
				cy.findByRole('button', { name: /Suivant/i }).click();

				cy.title().should('contain', 'Étape 3 sur 3');
				cy.url().should('include', '/stages/deposer-offre/localisation');
			});
		});
	});

	describe('quand l’utilisateur arrive sur la page de l’étape 3', () => {
		describe('et qu’il n’a pas rempli l’étape 1', () => {
			it('redirige vers l’étape 1', () => {
				cy.visit('/stages/deposer-offre/localisation', {
					onBeforeLoad(win: Cypress.AUTWindow) {
						win.sessionStorage.setItem(FORMULAIRE_ETAPE_2_LABEL, JSON.stringify(aFormulaireEtapeStage()));
					},
				});

				cy.title().should('contain', 'Étape 1 sur 3');
				cy.url().should('include', '/stages/deposer-offre');
				cy.url().should('not.include', 'votre-offre-de-stage');
			});
		});

		describe('et qu’il n’a pas rempli l’étape 2', () => {
			it('redirige vers l’étape 1', () => {
				cy.visit('/stages/deposer-offre/localisation', {
					onBeforeLoad(win: Cypress.AUTWindow) {
						win.localStorage.setItem(FORMULAIRE_ETAPE_1_LABEL, JSON.stringify(aFormulaireEtapeEntreprise()));
					},
				});

				cy.title().should('contain', 'Étape 1 sur 3');
				cy.url().should('include', '/stages/deposer-offre');
				cy.url().should('not.include', 'votre-offre-de-stage');
			});
		});

		describe('et qu‘il remplit le formulaire', () => {
			it('redirige vers la page de confirmation d’envoi', () => {
				cy.visit('/stages/deposer-offre/localisation', {
					onBeforeLoad(win: Cypress.AUTWindow) {
						win.localStorage.setItem(FORMULAIRE_ETAPE_1_LABEL, JSON.stringify(aFormulaireEtapeEntreprise()));
						win.sessionStorage.setItem(FORMULAIRE_ETAPE_2_LABEL, JSON.stringify(aFormulaireEtapeStage()));
					},
				});

				// NOTE (BRUJ 22/11/2023):  test flaky obligé de rajouter un click en amont
				cy.findByRole('combobox', { name: /Pays/ }).click();
				cy.findByRole('combobox', { name: /Pays/i }).type('France');
				cy.findAllByRole('option').first().click();
				cy.findByRole('textbox', { name: /Ville/i }).type(aFormulaireEtapeLocalisation().ville);
				cy.findByRole('textbox', { name: /Adresse/i }).type(aFormulaireEtapeLocalisation().adresse);
				cy.findByRole('textbox', { name: /Code postal/i }).type(aFormulaireEtapeLocalisation().codePostal);
				cy.findByRole('textbox', { name: /Région/i }).type(aFormulaireEtapeLocalisation().region);
				cy.findByRole('textbox', { name: /Département/i }).type(aFormulaireEtapeLocalisation().departement);

				interceptPost({
					actionBeforeWaitTheCall:() => cy.findByRole('button', { name: /Envoyer/i }).click(),
					alias: 'submit-form',
					path: '/api/stages',
					response: JSON.stringify({
						statusCode: 200,
					}),
					responseBodyToCheck: aFormulaireEnvoyePostedValue(),
				});

				cy.url().should('include', '/stages/deposer-offre/confirmation-envoi');
				cy.findByRole('heading', { level: 1 }).should('have.text', 'Merci, votre offre de stage a bien été envoyée');
			});
		});
	});
});
