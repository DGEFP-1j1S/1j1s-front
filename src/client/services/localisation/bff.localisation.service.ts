import { HttpClientService } from '~/client/services/httpClient.service';
import { LocalisationService } from '~/client/services/localisation/localisation.service';
import { Either } from '~/server/errors/either';
import { RésultatsRechercheCommune } from '~/server/localisations/domain/localisationAvecCoordonnées';
import {
	RechercheLocalisationApiResponse,
} from '~/server/localisations/infra/controllers/RechercheLocalisationApiResponse';

const DEPARTEMENT_METROPOLE_LENGTH = 2;
const DEPARTEMENT_DOMTOM_LENGTH = 3;
const CODE_CORSE_DU_SUD = '2a';
const CODE_HAUTE_CORSE = '2b';
const CODE_POSTAL_LENGTH = 5;
const REGEX_ALL_LETTRES_AVEC_ACCENTS_TIRET_ESPACE_AND_DIGITS = new RegExp(/^[\da-zA-ZÀ-ÖØ-öø-ÿ-\\ -\\() ]+$/);
const REGEX_ALL_DIGITS = new RegExp(/^\d*$/);

export class BffLocalisationService implements LocalisationService {
	constructor(private readonly httpClientService: HttpClientService ) {}

	isInvalidLocalisationQuery(recherche: string): boolean {
		const rechercheTrimmed = recherche.trim();
		const containsInvalidSymbols = !REGEX_ALL_LETTRES_AVEC_ACCENTS_TIRET_ESPACE_AND_DIGITS.test(rechercheTrimmed);
		const allDigits = REGEX_ALL_DIGITS.test(rechercheTrimmed);
		const isDepartementMetropolitain = allDigits && rechercheTrimmed.length === DEPARTEMENT_METROPOLE_LENGTH;
		const isDepartementDomTom = allDigits && rechercheTrimmed.length === DEPARTEMENT_DOMTOM_LENGTH;
		const isDepartementCorse = rechercheTrimmed.toLowerCase() === CODE_CORSE_DU_SUD || rechercheTrimmed.toLowerCase() === CODE_HAUTE_CORSE;
		const isDepartement = isDepartementMetropolitain || isDepartementDomTom || isDepartementCorse;
		const isCodePostal = allDigits && rechercheTrimmed.length === CODE_POSTAL_LENGTH;

		const CHARACTERS_TO_IGNORE = '()&+#$';
		const regexSearchCharToIgnore = new RegExp(`[${CHARACTERS_TO_IGNORE}]`, 'g');
		const rechercheWithoutCharToIgnore = rechercheTrimmed.replace(regexSearchCharToIgnore, '');
		const isQueryTooShort = rechercheWithoutCharToIgnore.length < 3 && !isDepartement && !isCodePostal ;

		// NOTE (GAFI 09-02-2023): Limite le nombre d'appels lorsqu'on sait que l'API Géo donnera une erreur
		return containsInvalidSymbols || isQueryTooShort;
	}

	async rechercherLocalisation(recherche: string): Promise<Either<RechercheLocalisationApiResponse> | null> {
		return this.httpClientService.get<RechercheLocalisationApiResponse>(`localisations?recherche=${recherche.trim()}`);
	}

	async rechercherCommune(recherche:string): Promise<Either<RésultatsRechercheCommune>> {
		return this.httpClientService.get<RésultatsRechercheCommune>(`communes?q=${recherche}`);
	}
}
