/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import { TypeÉtablissement } from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';
import {
	anEtablissementAccompagnement,
	anEtablissementAccompagnementList,
} from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement.fixture';
import { aCommuneList } from '~/server/localisations/domain/localisationAvecCoordonnées.fixture';

describe('Parcours Accompagnement', () => {
	beforeEach(() => {
		cy.viewport('iphone-x');
	});

	describe('quand l‘utilisateur arrive sur la page sans paramètre', () => {
		beforeEach(() => {
			cy.visit('/accompagnement');
		});
		describe('quand l‘utilisateur lance une recherche', () => {
			it('affiche les résultats de recherche', () => {
				cy.intercept(
					'GET',
					'/api/communes?q=*',
					JSON.stringify({ résultats: aCommuneList() }),
				).as('get-communes');

				cy.findByRole('combobox', { name: 'Localisation Exemples : Paris, Béziers…' }).type('par');
				cy.wait('@get-communes');
				cy.findByRole('listbox', { name: 'communes' })
					.within(() => cy.findAllByRole('option').first().click());

				cy.findByRole('combobox', { name: 'Type d‘accompagnement Exemple : Missions locales' }).click();
				cy.findByRole('listbox')
					.within(() => cy.findAllByRole('option').first().click());

				const apiResponse = [
					anEtablissementAccompagnement({ id: '1' }),
					anEtablissementAccompagnement({ id: '2' }),
				];

				cy.intercept({
					method: 'GET',
					path: '/api/etablissements-accompagnement*',
				}, JSON.stringify(apiResponse))
					.as('recherche-accompagnement');

				cy.findByRole('button', { name: 'Rechercher' }).click();
				cy.wait('@recherche-accompagnement');

				cy.findByRole('list', { name: 'Établissements d‘accompagnement' })
					.children('li')
					.should('have.length', 2);
			});
		});

		describe('quand l‘utilisateur souhaite contacter un établissement d‘accompagnement', () => {
			it('permet d‘envoyer une demande de contact', () => {
				cy.intercept(
					'GET',
					'/api/communes?q=*',
					JSON.stringify({ résultats: aCommuneList() }),
				).as('get-communes');

				cy.findByRole('combobox', { name: 'Localisation Exemples : Paris, Béziers…' }).type('par');
				cy.wait('@get-communes');
				cy.findByRole('listbox', { name: 'communes' })
					.within(() => cy.findAllByRole('option').first().click());

				cy.findByRole('combobox', { name: 'Type d‘accompagnement Exemple : Missions locales' }).click();
				cy.findByRole('listbox')
					.within(() => cy.findAllByRole('option').first().click());

				cy.intercept(
					'GET',
					'/api/etablissements-accompagnement*',
					JSON.stringify(anEtablissementAccompagnementList({
						type: TypeÉtablissement.MISSION_LOCALE,
					})),
				).as('recherche-accompagnement');
				cy.findByRole('button', { name: 'Rechercher' }).click();
				cy.wait('@recherche-accompagnement');

				cy.findByRole('list', { name: 'Établissements d‘accompagnement' })
					.children('li')
					.should('have.length', 1);

				cy.findByRole('button', { name: 'Je souhaite être contacté(e)' }).click();

				cy.findByRole('textbox', { name: 'Prénom Exemple : Jean' }).type('John', { force: true });
				cy.findByRole('textbox', { name: 'Nom Exemple : Dupont' }).type('Doe', { force: true });
				cy.findByRole('textbox', { name: /Adresse e-mail/ }).type('john.doe@email.com');
				cy.findByRole('textbox', { name: 'Téléphone Exemple : 0606060606' }).type('0606060606');
				cy.findByRole('combobox', { name: 'Age Exemple : 16 ans' }).click();
				cy.findByRole('option', { name: '23 ans' }).click();

				cy.intercept({
					method: 'GET',
					path: '/api/communes?q=*',
				}, JSON.stringify({ résultats: aCommuneList() }))
					.as('recherche-commune');

				cy.findAllByRole('combobox', { name: 'Localisation Exemples : Paris, Béziers…' }).last().type('par');
				cy.wait('@recherche-commune');

				cy.findByRole('listbox', { name: 'communes' })
					.within(() => cy.findAllByRole('option').first().click());
				cy.findByRole('textbox', { name: /Commentaires/ }).type('Merci de me recontacter');

				cy.intercept({ method: 'POST', pathname: '/api/etablissements-accompagnement/contact*' }, { statusCode: 201 });
				cy.findByRole('button', { name: 'Envoyer mes informations' }).click();

				cy.findByRole('heading', { level: 1, name: 'Votre demande a bien été transmise !' })
					.should('exist');
				cy.findByRole('button', { description: 'Fermer, Revenir à la page' }).click();

				cy.findByRole('dialog').should('not.exist');
			});
		});

		describe('quand l‘utilisateur n‘écrit rien et fait une recherche', () => {
			it('affiche un text indiquant qu‘il faut saisir une localisation', () => {
				cy.findByRole('button', { name: 'Rechercher' }).click();
				cy.findByText('Veuillez sélectionner une option dans la liste').should('be.visible');
			});
		});
	});

	describe('quand l‘utilisateur ajoute des paramètre incorrecte à la query', () => {
		it('affiche le message "Erreur - Demande incorrecte"', () => {
			cy.visit('/accompagnement?codeCommune=46102&oui=non');
			cy.findByText('Erreur - Demande incorrecte').should('be.visible');
		});
	});
});
