import type { Meilisearch } from 'meilisearch';

import { anOffreDeStageIndexee } from '~/server/stages/domain/offreDeStageIndexee.fixture';
import { createFailure, createSuccess } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { aLoggerService } from '~/server/services/logger.service.fixture';
import { MeilisearchErrorManagementService } from '~/server/services/meilisearch/meilisearchErrorManagement.service';
import { MeilisearchRechercheOffreStageRepository } from '~/server/stages/repository/meilisearchRechercheOffreStage.repository';

function aMeilisearchClient(override?: { multiSearch?: unknown, searchForFacetValues?: unknown }) {
	const searchForFacetValues = override?.searchForFacetValues ?? vi.fn().mockResolvedValue({ facetHits: [] });
	return {
		index: vi.fn().mockReturnValue({ searchForFacetValues }),
		multiSearch: override?.multiSearch ?? vi.fn().mockResolvedValue({ results: [{ hits: [], totalHits: 0 }, {}, {}] }),
	} as unknown as Meilisearch;
}

function aRepository(client: Meilisearch) {
	return new MeilisearchRechercheOffreStageRepository(client, 'offre-de-stage', new MeilisearchErrorManagementService(aLoggerService()));
}

describe('MeilisearchRechercheOffreStageRepository', () => {
	describe('rechercher', () => {
		it('recherche les offres avec tous les filtres, et chaque facette sans son propre filtre', async () => {
			const multiSearch = vi.fn().mockResolvedValue({ results: [{ hits: [], totalHits: 0 }, {}, {}] });
			const repository = aRepository(aMeilisearchClient({ multiSearch }));

			await repository.rechercher({ domaines: ['audit'], durees: ['2 mois'], localisations: [], motCle: 'juriste', page: 2 });

			expect(multiSearch).toHaveBeenCalledWith({
				queries: [
					{
						filter: [['domaines = "audit"'], ['dureeCategorisee = "2 mois"']],
						hitsPerPage: 15,
						indexUid: 'offre-de-stage',
						page: 2,
						q: 'juriste',
					},
					{ facets: ['domaines'], filter: [['dureeCategorisee = "2 mois"']], indexUid: 'offre-de-stage', limit: 0, q: 'juriste' },
					{ facets: ['dureeCategorisee'], filter: [['domaines = "audit"']], indexUid: 'offre-de-stage', limit: 0, q: 'juriste' },
				],
			});
		});

		it('renvoie les offres, leur nombre et les facettes', async () => {
			const offre = anOffreDeStageIndexee();
			const multiSearch = vi.fn().mockResolvedValue({
				results: [
					{ hits: [offre], totalHits: 42 },
					{ facetDistribution: { domaines: { audit: 3, conseil: 1 } } },
					{ facetDistribution: { dureeCategorisee: { '2 mois': 2 } } },
				],
			});
			const repository = aRepository(aMeilisearchClient({ multiSearch }));

			const resultat = await repository.rechercher({ domaines: [], durees: [], localisations: [], page: 1 });

			expect(resultat).toStrictEqual(createSuccess({
				facettes: {
					domaines: [{ nombre: 3, valeur: 'audit' }, { nombre: 1, valeur: 'conseil' }],
					durees: [{ nombre: 2, valeur: '2 mois' }],
				},
				nombreDeResultats: 42,
				resultats: [offre],
			}));
		});

		it('renvoie SERVICE_INDISPONIBLE quand Meilisearch est en erreur', async () => {
			const repository = aRepository(aMeilisearchClient({ multiSearch: vi.fn().mockRejectedValue(new Error('connexion refusée')) }));

			const resultat = await repository.rechercher({ domaines: [], durees: [], localisations: [], page: 1 });

			expect(resultat).toStrictEqual(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));
		});
	});

	describe('rechercherLocalisations', () => {
		it('renvoie au plus 20 localisations correspondant à la saisie', async () => {
			const facetHits = Array.from({ length: 25 }, (_, index) => ({ count: 1, value: `Ville ${index}` }));
			const searchForFacetValues = vi.fn().mockResolvedValue({ facetHits });
			const repository = aRepository(aMeilisearchClient({ searchForFacetValues }));

			const resultat = await repository.rechercherLocalisations('vi');

			expect(searchForFacetValues).toHaveBeenCalledWith({ facetName: 'localisationFiltree', facetQuery: 'vi' });
			expect(resultat).toStrictEqual(createSuccess(facetHits.slice(0, 20).map(({ value }) => value)));
		});

		it('renvoie SERVICE_INDISPONIBLE quand Meilisearch est en erreur', async () => {
			const repository = aRepository(aMeilisearchClient({ searchForFacetValues: vi.fn().mockRejectedValue(new Error('timeout')) }));

			const resultat = await repository.rechercherLocalisations('vi');

			expect(resultat).toStrictEqual(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));
		});
	});
});
