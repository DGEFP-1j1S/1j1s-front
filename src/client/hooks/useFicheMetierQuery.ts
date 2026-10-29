import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { getArrayQueryParam, getSingleQueryParam } from '~/client/utils/queryParams.utils';

export type FicheMetierQueryParams = {
	motCle?: string
	centresInteret?: Array<string>
	page?: string
}

export function useFicheMetierQuery(): FicheMetierQueryParams {
	const { query } = useRouter();
	return useMemo(() => ({
		centresInteret: getArrayQueryParam(query.centresInteret),
		motCle: getSingleQueryParam(query.motCle),
		page: getSingleQueryParam(query.page),
	}), [query.centresInteret, query.motCle, query.page]);
}
