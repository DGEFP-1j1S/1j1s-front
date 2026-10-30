import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { getValeursQueryParam, getSingleQueryParam } from '~/client/utils/queryParams.utils';

export type AnnonceDeLogementQueryParams = {
	ville?: string
	typesOffre?: Array<string>
	typesBien?: Array<string>
	prixMin?: string
	prixMax?: string
	surfaceMin?: string
	surfaceMax?: string
	page?: string
}

export function useAnnonceDeLogementQuery(): AnnonceDeLogementQueryParams {
	const { query } = useRouter();
	return useMemo(() => ({
		page: getSingleQueryParam(query.page),
		prixMax: getSingleQueryParam(query.prixMax),
		prixMin: getSingleQueryParam(query.prixMin),
		surfaceMax: getSingleQueryParam(query.surfaceMax),
		surfaceMin: getSingleQueryParam(query.surfaceMin),
		typesBien: getValeursQueryParam(query.typesBien),
		typesOffre: getValeursQueryParam(query.typesOffre),
		ville: getSingleQueryParam(query.ville),
	}), [query.page, query.prixMax, query.prixMin, query.surfaceMax, query.surfaceMin, query.typesBien, query.typesOffre, query.ville]);
}
