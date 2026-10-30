// @vitest-environment node
import ServerConfigurationService from '~/server/services/serverConfiguration.service';

describe('ServerConfigurationService', () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	describe('variables Meilisearch', () => {
		it('lit les nouveaux noms MEILISEARCH_*', () => {
			vi.stubEnv('MEILISEARCH_BASE_URL', 'https://nouveau.example.com');
			vi.stubEnv('NEXT_PUBLIC_STAGE_SEARCH_ENGINE_BASE_URL', 'https://ancien.example.com');

			const configuration = new ServerConfigurationService().getConfiguration();

			expect(configuration.MEILISEARCH_BASE_URL).toBe('https://nouveau.example.com');
		});

		it('se replie sur les anciens noms NEXT_PUBLIC_* quand les nouveaux sont absents', () => {
			vi.stubEnv('MEILISEARCH_API_KEY', '');
			vi.stubEnv('NEXT_PUBLIC_STAGE_SEARCH_ENGINE_API_KEY', 'ancienne-cle');
			vi.stubEnv('MEILISEARCH_INDEX_OFFRE_DE_STAGE', '');
			vi.stubEnv('NEXT_PUBLIC_INDEX_OFFRE_DE_STAGE', 'ancien-index');

			const configuration = new ServerConfigurationService().getConfiguration();

			expect(configuration.MEILISEARCH_API_KEY).toBe('ancienne-cle');
			expect(configuration.MEILISEARCH_INDEX_OFFRE_DE_STAGE).toBe('ancien-index');
		});

		it('signale le nouveau nom quand aucune des deux variables n‘est définie', () => {
			vi.stubEnv('MEILISEARCH_INDEX_ANNONCE_DE_LOGEMENT', '');
			vi.stubEnv('NEXT_PUBLIC_INDEX_ANNONCE_DE_LOGEMENT', '');

			expect(() => new ServerConfigurationService().getConfiguration()).toThrow('Variable MEILISEARCH_INDEX_ANNONCE_DE_LOGEMENT missing from environment!');
		});
	});
});
