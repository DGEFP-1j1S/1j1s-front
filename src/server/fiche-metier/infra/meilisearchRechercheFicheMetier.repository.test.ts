import type { Meilisearch } from 'meilisearch';

import { createFailure, createSuccess } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { MeilisearchRechercheFicheMetierRepository } from '~/server/fiche-metier/infra/meilisearchRechercheFicheMetier.repository';
import { MeilisearchErrorManagementService } from '~/server/services/meilisearch/meilisearchErrorManagement.service';
import { aLoggerService } from '~/server/services/logger.service.fixture';

function aRepository(multiSearch: unknown) {
	return new MeilisearchRechercheFicheMetierRepository({ multiSearch } as unknown as Meilisearch, new MeilisearchErrorManagementService(aLoggerService()));
}

describe('MeilisearchRechercheFicheMetierRepository', () => {
	it('recherche les fiches métier par mot-clé et centres d‘intérêt, et renvoie la facette des centres d‘intérêt', async () => {
		const ficheMetier = { accroche_metier: 'accroche', nom_metier: 'cuisinier' };
		const multiSearch = vi.fn().mockResolvedValue({
			results: [
				{ hits: [ficheMetier], totalHits: 1 },
				{ facetDistribution: { centres_interet: { 'j‘aime bouger': 2 } } },
			],
		});

		const resultat = await aRepository(multiSearch).rechercher({ centresInteret: ['j‘aime bouger'], motCle: 'cuisinier', page: 1 });

		expect(multiSearch).toHaveBeenCalledWith({
			queries: [
				{ filter: [['centres_interet = "j‘aime bouger"']], hitsPerPage: 15, indexUid: 'fiche-metier', page: 1, q: 'cuisinier' },
				{ facets: ['centres_interet'], filter: [], indexUid: 'fiche-metier', limit: 0, q: 'cuisinier' },
			],
		});
		expect(resultat).toStrictEqual(createSuccess({
			facettes: { centresInteret: [{ nombre: 2, valeur: 'j‘aime bouger' }] },
			nombreDeResultats: 1,
			resultats: [ficheMetier],
		}));
	});

	it('renvoie SERVICE_INDISPONIBLE quand Meilisearch est en erreur', async () => {
		const resultat = await aRepository(vi.fn().mockRejectedValue(new Error('timeout'))).rechercher({ centresInteret: [], page: 1 });

		expect(resultat).toStrictEqual(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));
	});
});
