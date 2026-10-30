import type { Meilisearch } from 'meilisearch';

import { createFailure } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { MeilisearchRechercheAnnonceDeLogementRepository } from '~/server/logements/infra/meilisearchRechercheAnnonceDeLogement.repository';
import { aLoggerService } from '~/server/services/logger.service.fixture';
import { MeilisearchErrorManagementService } from '~/server/services/meilisearch/meilisearchErrorManagement.service';

function aRepository(multiSearch: unknown) {
	return new MeilisearchRechercheAnnonceDeLogementRepository(
		{ multiSearch } as unknown as Meilisearch,
		'annonce-de-logement',
		['www.immojeune.com'],
		new MeilisearchErrorManagementService(aLoggerService()),
	);
}

const FILTRE_VIDE = { page: 1, prix: {}, surface: {}, typesBien: [], typesOffre: [] };

describe('MeilisearchRechercheAnnonceDeLogementRepository', () => {
	it('recherche par ville avec les types en facettes et les intervalles de prix et de surface', async () => {
		const multiSearch = vi.fn().mockResolvedValue({ results: [{ hits: [], totalHits: 0 }, {}, {}] });

		await aRepository(multiSearch).rechercher({
			page: 2,
			prix: { max: 600, min: 300 },
			surface: { min: 20 },
			typesBien: ['appartement'],
			typesOffre: [],
			ville: 'Lyon',
		});

		expect(multiSearch).toHaveBeenCalledWith({
			queries: [
				{ filter: [['typeBien = "appartement"'], 'prix >= 300', 'prix <= 600', 'surface >= 20'], hitsPerPage: 9, indexUid: 'annonce-de-logement', page: 2, q: 'Lyon' },
				{ facets: ['type'], filter: [['typeBien = "appartement"'], 'prix >= 300', 'prix <= 600', 'surface >= 20'], indexUid: 'annonce-de-logement', limit: 0, q: 'Lyon' },
				{ facets: ['typeBien'], filter: ['prix >= 300', 'prix <= 600', 'surface >= 20'], indexUid: 'annonce-de-logement', limit: 0, q: 'Lyon' },
			],
		});
	});

	it('ne garde que les images des hôtes autorisés', async () => {
		const multiSearch = vi.fn().mockResolvedValue({
			results: [
				{ hits: [{ imagesUrl: ['https://www.immojeune.com/a.jpg', 'https://media.inconnu.com/b.jpg'], slug: 'annonce' }], totalHits: 1 },
				{ facetDistribution: { type: { location: 1 } } },
				{ facetDistribution: { typeBien: { appartement: 1 } } },
			],
		});

		const resultat = await aRepository(multiSearch).rechercher(FILTRE_VIDE);

		expect(resultat).toMatchObject({
			instance: 'success',
			result: {
				facettes: { typesBien: [{ nombre: 1, valeur: 'appartement' }], typesOffre: [{ nombre: 1, valeur: 'location' }] },
				resultats: [{ imagesUrl: ['https://www.immojeune.com/a.jpg'], slug: 'annonce' }],
			},
		});
	});

	it('renvoie SERVICE_INDISPONIBLE quand Meilisearch est en erreur', async () => {
		const resultat = await aRepository(vi.fn().mockRejectedValue(new Error('timeout'))).rechercher(FILTRE_VIDE);

		expect(resultat).toStrictEqual(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));
	});
});
