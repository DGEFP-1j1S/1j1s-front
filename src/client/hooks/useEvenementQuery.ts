import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { getValeursQueryParam, getSingleQueryParam } from '~/client/utils/queryParams.utils';

export type EvenementQueryParams = {
	motCle?: string
	lieux?: Array<string>
	page?: string
}

export function useEvenementQuery(): EvenementQueryParams {
	const { query } = useRouter();
	return useMemo(() => ({
		lieux: getValeursQueryParam(query.lieux),
		motCle: getSingleQueryParam(query.motCle),
		page: getSingleQueryParam(query.page),
	}), [query.lieux, query.motCle, query.page]);
}
