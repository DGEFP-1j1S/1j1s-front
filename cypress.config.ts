import { defineConfig } from 'cypress';

import { choisirReponseMeilisearch, startMeilisearchMockedServer } from './cypress/meilisearchMockedServer';

export default defineConfig({
	e2e: {
		baseUrl: 'http://127.0.0.1:3000',
		defaultCommandTimeout: 10000,
		pageLoadTimeout: 100000,
		requestTimeout: 20000,
		retries: 1,
		screenshotOnRunFailure: false,
		setupNodeEvents(on) {
			startMeilisearchMockedServer();
			on('task', { choisirReponseMeilisearch });
		},
		video: false,
	},
});
