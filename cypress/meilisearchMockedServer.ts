/// <reference types="node" />

import { createServer, Server } from 'http';

type ReponseMultiSearch = { results: Array<Record<string, unknown>> };

let reponseMultiSearch: ReponseMultiSearch = { results: [{ hits: [], totalHits: 0 }] };

export function choisirReponseMeilisearch(reponse: ReponseMultiSearch) {
	reponseMultiSearch = reponse;
	return null;
}

export function startMeilisearchMockedServer(url = process.env.MEILISEARCH_BASE_URL ?? 'http://localhost:7700'): Server {
	return createServer((requete, reponse) => {
		let corps = '';
		requete.on('data', (morceau) => { corps += morceau; });
		requete.on('end', () => {
			reponse.setHeader('Content-Type', 'application/json');
			if (requete.url === '/multi-search') {
				const { queries = [] } = corps ? JSON.parse(corps) : {};
				reponse.end(JSON.stringify({ results: queries.map(() => reponseMultiSearch.results[0]) }));
				return;
			}
			reponse.end(JSON.stringify({ facetHits: [], facetQuery: '', processingTimeMs: 0 }));
		});
	}).listen(Number(new URL(url).port));
}
