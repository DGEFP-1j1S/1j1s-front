import type { Meilisearch } from 'meilisearch';

import { createFailure, createSuccess } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { MeilisearchRechercheEvenementRepository } from '~/server/evenements/infra/meilisearchRechercheEvenement.repository';
import { aLoggerService } from '~/server/services/logger.service.fixture';
import { MeilisearchErrorManagementService } from '~/server/services/meilisearch/meilisearchErrorManagement.service';

function aRepository(client: Partial<Record<'multiSearch' | 'index', unknown>>) {
	return new MeilisearchRechercheEvenementRepository(client as unknown as Meilisearch, new MeilisearchErrorManagementService(aLoggerService()));
}

describe('MeilisearchRechercheEvenementRepository', () => {
	describe('rechercher', () => {
		it('recherche les évènements par mot-clé et lieux', async () => {
			const evenement = { dateDebut: '', dateFin: '', lieu: 'Paris', organismeOrganisateur: '', slug: 'forum', titre: 'Forum' };
			const multiSearch = vi.fn().mockResolvedValue({ results: [{ hits: [evenement], totalHits: 1 }] });

			const resultat = await aRepository({ multiSearch }).rechercher({ lieux: ['Paris', 'Lyon'], motCle: 'emploi', page: 3 });

			expect(multiSearch).toHaveBeenCalledWith({
				queries: [{ filter: [['lieu = "Paris"', 'lieu = "Lyon"']], hitsPerPage: 15, indexUid: 'evenement', page: 3, q: 'emploi' }],
			});
			expect(resultat).toStrictEqual(createSuccess({ nombreDeResultats: 1, resultats: [evenement] }));
		});

		it('renvoie SERVICE_INDISPONIBLE quand Meilisearch est en erreur', async () => {
			const resultat = await aRepository({ multiSearch: vi.fn().mockRejectedValue(new Error('timeout')) }).rechercher({ lieux: [], page: 1 });

			expect(resultat).toStrictEqual(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));
		});
	});

	describe('rechercherLieux', () => {
		it('cherche les lieux correspondant à la saisie dans la facette lieu', async () => {
			const searchForFacetValues = vi.fn().mockResolvedValue({ facetHits: [{ count: 2, value: 'Paris' }] });

			const resultat = await aRepository({ index: vi.fn().mockReturnValue({ searchForFacetValues }) }).rechercherLieux('pa');

			expect(searchForFacetValues).toHaveBeenCalledWith({ facetName: 'lieu', facetQuery: 'pa' });
			expect(resultat).toStrictEqual(createSuccess(['Paris']));
		});
	});
});
