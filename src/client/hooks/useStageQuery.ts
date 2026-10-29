import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { getArrayQueryParam, getSingleQueryParam } from '~/client/utils/queryParams.utils';

export type StageQueryParams = {
	motCle?: string
	localisations?: Array<string>
	domaines?: Array<string>
	durees?: Array<string>
	page?: string
}

export function useStageQuery(): StageQueryParams {
	const { query } = useRouter();
	return useMemo(() => ({
		domaines: getArrayQueryParam(query.domaines),
		durees: getArrayQueryParam(query.durees),
		localisations: getArrayQueryParam(query.localisations),
		motCle: getSingleQueryParam(query.motCle),
		page: getSingleQueryParam(query.page),
	}), [query.domaines, query.durees, query.localisations, query.motCle, query.page]);
}
