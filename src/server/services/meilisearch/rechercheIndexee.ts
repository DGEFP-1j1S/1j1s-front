import type { CategoriesDistribution, Meilisearch, MultiSearchQuery } from 'meilisearch';

export interface Facette {
	valeur: string
	nombre: number
}

/** valeurs cochées par attribut : OU entre les valeurs d‘un attribut, ET entre les attributs */
export type FiltresParAttribut = Record<string, Array<string>>;

export interface Intervalle {
	min?: number
	max?: number
}
export type IntervallesParAttribut = Record<string, Intervalle>;

export interface RequeteRechercheIndexee {
	motCle?: string
	filtres: FiltresParAttribut
	intervalles?: IntervallesParAttribut
	/** attributs dont on veut les valeurs possibles, pour proposer les options des champs du formulaire */
	facettes: Array<string>
	page: number
	nombreDeResultatsParPage: number
}

export interface ReponseRechercheIndexee<T> {
	resultats: Array<T>
	nombreDeResultats: number
	facettes: Record<string, Array<Facette>>
}

/**
 * Recherche dans un index Meilisearch avec des facettes disjonctives : comme InstantSearch, une requête par facette
 * sans le filtre de cette facette, pour que les options non cochées restent proposées. Meilisearch ne le fait pas
 * en une seule requête.
 */
export async function rechercherAvecFacettesDisjonctives<T extends Record<string, unknown>>(
	client: Meilisearch,
	indexUid: string,
	requete: RequeteRechercheIndexee,
): Promise<ReponseRechercheIndexee<T>> {
	const { motCle, filtres, intervalles = {}, facettes, page, nombreDeResultatsParPage } = requete;
	const requeteDeBase = { indexUid, q: motCle ?? '' };
	const queries: Array<MultiSearchQuery> = [
		{
			...requeteDeBase,
			filter: construireFiltre(filtres, intervalles),
			hitsPerPage: nombreDeResultatsParPage,
			page,
		},
		...facettes.map((facette) => ({
			...requeteDeBase,
			facets: [facette],
			filter: construireFiltre(filtres, intervalles, facette),
			limit: 0,
		})),
	];

	const { results: [resultats, ...resultatsDesFacettes] } = await client.multiSearch<{ queries: Array<MultiSearchQuery> }, T>({ queries });

	return {
		facettes: Object.fromEntries(facettes.map((facette, index) => [
			facette,
			versFacettes(resultatsDesFacettes[index].facetDistribution?.[facette]),
		])),
		nombreDeResultats: resultats.totalHits ?? resultats.estimatedTotalHits ?? 0,
		resultats: resultats.hits,
	};
}

/**
 * L‘attribut ignoré sert aux facettes disjonctives : la facette d‘un attribut est calculée sans son propre filtre.
 */
export function construireFiltre(
	filtres: FiltresParAttribut,
	intervalles: IntervallesParAttribut = {},
	attributIgnore?: string,
): Array<string | Array<string>> {
	const filtresDesValeurs = Object.entries(filtres)
		.filter(([attribut, valeurs]) => attribut !== attributIgnore && valeurs.length > 0)
		.map(([attribut, valeurs]) => valeurs.map((valeur) => `${attribut} = "${echapper(valeur)}"`));
	const filtresDesIntervalles = Object.entries(intervalles)
		.flatMap(([attribut, { min, max }]) => [
			min !== undefined ? `${attribut} >= ${min}` : undefined,
			max !== undefined ? `${attribut} <= ${max}` : undefined,
		])
		.filter((filtre): filtre is string => filtre !== undefined);
	return [...filtresDesValeurs, ...filtresDesIntervalles];
}

function echapper(valeur: string) {
	return valeur.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function versFacettes(distribution: CategoriesDistribution = {}): Array<Facette> {
	return Object.entries(distribution).map(([valeur, nombre]) => ({ nombre, valeur }));
}

/** valeurs d‘une facette correspondant à une saisie (ex : localisations proposées pendant la frappe) */
export async function rechercherValeursDeFacette(client: Meilisearch, indexUid: string, facette: string, saisie: string, nombreMaximum: number): Promise<Array<string>> {
	const { facetHits } = await client.index(indexUid).searchForFacetValues({ facetName: facette, facetQuery: saisie });
	return facetHits.map(({ value }) => value).slice(0, nombreMaximum);
}
