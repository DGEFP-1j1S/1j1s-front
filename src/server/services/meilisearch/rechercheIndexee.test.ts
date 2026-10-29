import type { Meilisearch } from 'meilisearch';

import {
	construireFiltre,
	rechercherAvecFacettesDisjonctives,
	rechercherValeursDeFacette,
} from '~/server/services/meilisearch/rechercheIndexee';

describe('construireFiltre', () => {
	it('fait un OU entre les valeurs d‘un attribut et un ET entre les attributs, en ignorant les attributs vides', () => {
		const filtre = construireFiltre({ domaines: ['audit', 'conseil'], dureeCategorisee: [], localisationFiltree: ['Paris'] });

		expect(filtre).toStrictEqual([
			['domaines = "audit"', 'domaines = "conseil"'],
			['localisationFiltree = "Paris"'],
		]);
	});

	it('ignore l‘attribut demandé, pour les facettes disjonctives', () => {
		const filtre = construireFiltre({ domaines: ['audit'], localisationFiltree: ['Paris'] }, {}, 'domaines');

		expect(filtre).toStrictEqual([['localisationFiltree = "Paris"']]);
	});

	it('échappe les guillemets et les antislashs des valeurs', () => {
		const filtre = construireFiltre({ domaines: ['a "b" \\ c'] });

		expect(filtre).toStrictEqual([['domaines = "a \\"b\\" \\\\ c"']]);
	});

	it('ajoute les bornes renseignées des intervalles', () => {
		const filtre = construireFiltre({ type: ['location'] }, { prix: { max: 800, min: 300 }, surface: { min: 20 } });

		expect(filtre).toStrictEqual([['type = "location"'], 'prix >= 300', 'prix <= 800', 'surface >= 20']);
	});
});

describe('rechercherAvecFacettesDisjonctives', () => {
	it('recherche les résultats avec tous les filtres, et chaque facette sans son propre filtre', async () => {
		const multiSearch = vi.fn().mockResolvedValue({ results: [{ hits: [], totalHits: 0 }, {}, {}] });

		await rechercherAvecFacettesDisjonctives({ multiSearch } as unknown as Meilisearch, 'index', {
			facettes: ['domaines', 'dureeCategorisee'],
			filtres: { domaines: ['audit'], dureeCategorisee: ['2 mois'] },
			intervalles: { prix: { max: 800 } },
			motCle: 'juriste',
			nombreDeResultatsParPage: 15,
			page: 2,
		});

		expect(multiSearch).toHaveBeenCalledWith({
			queries: [
				{ filter: [['domaines = "audit"'], ['dureeCategorisee = "2 mois"'], 'prix <= 800'], hitsPerPage: 15, indexUid: 'index', page: 2, q: 'juriste' },
				{ facets: ['domaines'], filter: [['dureeCategorisee = "2 mois"'], 'prix <= 800'], indexUid: 'index', limit: 0, q: 'juriste' },
				{ facets: ['dureeCategorisee'], filter: [['domaines = "audit"'], 'prix <= 800'], indexUid: 'index', limit: 0, q: 'juriste' },
			],
		});
	});

	it('renvoie les résultats, leur nombre et les facettes', async () => {
		const multiSearch = vi.fn().mockResolvedValue({
			results: [
				{ hits: [{ id: 1 }], totalHits: 42 },
				{ facetDistribution: { domaines: { audit: 3, conseil: 1 } } },
			],
		});

		const reponse = await rechercherAvecFacettesDisjonctives({ multiSearch } as unknown as Meilisearch, 'index', {
			facettes: ['domaines'], filtres: {}, nombreDeResultatsParPage: 15, page: 1,
		});

		expect(reponse).toStrictEqual({
			facettes: { domaines: [{ nombre: 3, valeur: 'audit' }, { nombre: 1, valeur: 'conseil' }] },
			nombreDeResultats: 42,
			resultats: [{ id: 1 }],
		});
	});
});

describe('rechercherValeursDeFacette', () => {
	it('renvoie au plus le nombre demandé de valeurs correspondant à la saisie', async () => {
		const facetHits = Array.from({ length: 25 }, (_, index) => ({ count: 1, value: `Ville ${index}` }));
		const searchForFacetValues = vi.fn().mockResolvedValue({ facetHits });
		const client = { index: vi.fn().mockReturnValue({ searchForFacetValues }) } as unknown as Meilisearch;

		const valeurs = await rechercherValeursDeFacette(client, 'index', 'lieu', 'vi', 20);

		expect(client.index).toHaveBeenCalledWith('index');
		expect(searchForFacetValues).toHaveBeenCalledWith({ facetName: 'lieu', facetQuery: 'vi' });
		expect(valeurs).toStrictEqual(facetHits.slice(0, 20).map(({ value }) => value));
	});
});
