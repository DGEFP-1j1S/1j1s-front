import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { getSingleQueryParam } from '~/client/utils/queryParams.utils';
import { Commune } from '~/server/localisations/domain/localisationAvecCoordonnées';

export type CommuneQueryParams = {
	codeCommune: string | undefined
	latitudeCommune: string | undefined
	longitudeCommune: string | undefined
	codePostal: string | undefined
	ville: string | undefined
} // FIXME (SULI 20-12-2023): le nom des champs est intimement lié au "name" des inputs hidden dans combobox commune :(
// FIXME à cause de getFormAsQuery

export function useCommuneQuery(): CommuneQueryParams {
	const { query } = useRouter();
	return useMemo<CommuneQueryParams>(() => ({
		codeCommune: getSingleQueryParam(query.codeCommune),
		codePostal: getSingleQueryParam(query.codePostal),
		latitudeCommune: getSingleQueryParam(query.latitudeCommune),
		longitudeCommune: getSingleQueryParam(query.longitudeCommune),
		ville: getSingleQueryParam(query.ville),
	}), [query]);
}

export function aCommuneQuery(overrides?: Partial<CommuneQueryParams>): CommuneQueryParams {
	return {
		codeCommune: '75056',
		codePostal: '75006',
		latitudeCommune: '48.859',
		longitudeCommune: '2.347',
		ville: 'Paris',
		...overrides,
	};
}

export function mapToCommune(communeQuery: CommuneQueryParams): Commune | undefined {
	const isCommuneAvailableInQuery = communeQuery.codeCommune
		&& communeQuery.codePostal
		&& communeQuery.ville
		&& communeQuery.longitudeCommune
		&& communeQuery.latitudeCommune;

	if (!isCommuneAvailableInQuery) {
		return undefined;
	}

	return {
		code: communeQuery.codeCommune!,
		codePostal: communeQuery.codePostal!,
		coordonnées: {
			latitude: Number(communeQuery.latitudeCommune),
			longitude: Number(communeQuery.longitudeCommune),
		},
		ville: communeQuery.ville!,
	};
}
