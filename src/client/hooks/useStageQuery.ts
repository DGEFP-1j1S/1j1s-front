import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { getValeursQueryParam, getSingleQueryParam } from '~/client/utils/queryParams.utils';

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
		domaines: getValeursQueryParam(query.domaines),
		durees: getValeursQueryParam(query.durees),
		localisations: getValeursQueryParam(query.localisations),
		motCle: getSingleQueryParam(query.motCle),
		page: getSingleQueryParam(query.page),
	}), [query.domaines, query.durees, query.localisations, query.motCle, query.page]);
}
