import { formatRechercherSolutionDocumentTitle } from '~/client/utils/formatRechercherSolutionDocumentTitle.util';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { ErreurTechnique } from '~/server/errors/erreurTechnique.types';

describe('formatRechercherSolutionDocumentTitle', () => {
	const titreParDefaut = 'Rechercher une formation en apprentissage';
	const intitules = {
		aucun: 'Aucune formation en alternance',
		pluriel: 'formations en alternance',
		singulier: 'formation en alternance',
	};

	it('renvoie le titre par défaut quand aucune recherche n’a été lancée', () => {
		const titre = formatRechercherSolutionDocumentTitle({ intitules, titreParDefaut });

		expect(titre).toEqual('Rechercher une formation en apprentissage | 1jeune1solution');
	});

	it('reprend le nombre de résultats et les critères de la recherche', () => {
		const titre = formatRechercherSolutionDocumentTitle({
			criteres: ['Gestion de projets informatiques', 'Paris'],
			intitules,
			nombreResultats: 100,
			titreParDefaut,
		});

		expect(titre).toEqual('100 formations en alternance pour Gestion de projets informatiques, Paris | 1jeune1solution');
	});

	it('utilise le singulier pour un seul résultat', () => {
		const titre = formatRechercherSolutionDocumentTitle({ criteres: ['Paris'], intitules, nombreResultats: 1, titreParDefaut });

		expect(titre).toEqual('1 formation en alternance pour Paris | 1jeune1solution');
	});

	it('sépare les milliers du nombre de résultats', () => {
		const titre = formatRechercherSolutionDocumentTitle({ intitules, nombreResultats: 12345, titreParDefaut });

		expect(titre).toEqual('12 345 formations en alternance | 1jeune1solution');
	});

	it('indique qu’il n’y a aucun résultat', () => {
		const titre = formatRechercherSolutionDocumentTitle({
			criteres: ['Gestion de projets informatiques', 'Béziers'],
			intitules,
			nombreResultats: 0,
			titreParDefaut,
		});

		expect(titre).toEqual('Aucune formation en alternance pour Gestion de projets informatiques, Béziers | 1jeune1solution');
	});

	it('ignore les critères non renseignés', () => {
		const titre = formatRechercherSolutionDocumentTitle({ criteres: [undefined, '', 'Paris'], intitules, nombreResultats: 2, titreParDefaut });

		expect(titre).toEqual('2 formations en alternance pour Paris | 1jeune1solution');
	});

	it('n’ajoute pas « pour » sans critère', () => {
		const titre = formatRechercherSolutionDocumentTitle({ criteres: [], intitules, nombreResultats: 2, titreParDefaut });

		expect(titre).toEqual('2 formations en alternance | 1jeune1solution');
	});

	describe('pagination', () => {
		it('indique la page courante quand il y a plusieurs pages', () => {
			const titre = formatRechercherSolutionDocumentTitle({
				criteres: ['toulouse'],
				intitules,
				nombreResultats: 1416,
				pagination: { nombreResultatsParPage: 54, pageCourante: '2' },
				titreParDefaut,
			});

			expect(titre).toEqual('1 416 formations en alternance pour toulouse (page 2/27) | 1jeune1solution');
		});

		it('considère la première page quand la page n’est pas renseignée', () => {
			const titre = formatRechercherSolutionDocumentTitle({
				intitules,
				nombreResultats: 30,
				pagination: { nombreResultatsParPage: 15 },
				titreParDefaut,
			});

			expect(titre).toEqual('30 formations en alternance (page 1/2) | 1jeune1solution');
		});

		it('n’indique pas la page quand il n’y en a qu’une', () => {
			const titre = formatRechercherSolutionDocumentTitle({
				intitules,
				nombreResultats: 15,
				pagination: { nombreResultatsParPage: 15, pageCourante: 1 },
				titreParDefaut,
			});

			expect(titre).toEqual('15 formations en alternance | 1jeune1solution');
		});

		it('n’indique pas la page quand il n’y a aucun résultat', () => {
			const titre = formatRechercherSolutionDocumentTitle({
				intitules,
				nombreResultats: 0,
				pagination: { nombreResultatsParPage: 15, pageCourante: 1 },
				titreParDefaut,
			});

			expect(titre).toEqual('Aucune formation en alternance | 1jeune1solution');
		});

		it('limite le nombre de pages au maximum autorisé', () => {
			const titre = formatRechercherSolutionDocumentTitle({
				intitules,
				nombreResultats: 10000,
				pagination: { nombrePagesMax: 67, nombreResultatsParPage: 15, pageCourante: 3 },
				titreParDefaut,
			});

			expect(titre).toEqual('10 000 formations en alternance (page 3/67) | 1jeune1solution');
		});
	});

	it('préfixe le titre par défaut par « Erreur : » quand la demande est incorrecte', () => {
		const titre = formatRechercherSolutionDocumentTitle({
			criteres: ['Paris'],
			erreur: ErreurMetier.DEMANDE_INCORRECTE,
			intitules,
			titreParDefaut,
		});

		expect(titre).toEqual('Erreur : Rechercher une formation en apprentissage | 1jeune1solution');
	});

	it('indique que le service est indisponible', () => {
		const titre = formatRechercherSolutionDocumentTitle({ erreur: ErreurMetier.SERVICE_INDISPONIBLE, intitules, titreParDefaut });

		expect(titre).toEqual('Rechercher une formation en apprentissage - Service indisponible | 1jeune1solution');
	});

	it('renvoie le titre par défaut pour les autres erreurs', () => {
		const titre = formatRechercherSolutionDocumentTitle({ erreur: ErreurTechnique.TOO_MANY_REQUESTS, intitules, nombreResultats: 3, titreParDefaut });

		expect(titre).toEqual('Rechercher une formation en apprentissage | 1jeune1solution');
	});
});
