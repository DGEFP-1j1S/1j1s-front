export interface ApiLaBonneAlternanceFormationRechercheResponseCompany {
	name?: string;
}

export interface ApiLaBonneAlternanceFormationRechercheResponsePlace {
	city?: string;
	fullAddress?: string;
	latitude?: number;
	longitude?: number;
	zipCode?: string;
}

export interface ApiLaBonneAlternanceFormationRechercheResponseFormation {
	title: string;
	company?: ApiLaBonneAlternanceFormationRechercheResponseCompany;
	place?: ApiLaBonneAlternanceFormationRechercheResponsePlace;
	diplomaLevel?: string;
	idRco: string;
	cfd?: string;
	cleMinistereEducatif?: string;
}

export interface ApiLaBonneAlternanceFormationRechercheResponse {
	results: Array<ApiLaBonneAlternanceFormationRechercheResponseFormation>;
}

export interface ApiLaBonneAlternanceFormationResponse {
	results: ApiLaBonneAlternanceFormation[];
}

export interface ApiLaBonneAlternanceFormation {
	title?: string,
	place?: {
		fullAddress?: string,
		city?: string,
		latitude?: number
		longitude?: number,
		zipCode?: string,
	},
	company?: {
		name?: string
	},
	id: string,
	cleMinistereEducatif: string,
	training?: {
		description?: string,
		objectif?: string,
	}
}
