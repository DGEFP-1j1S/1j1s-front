import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { CommuneQueryParams, useCommuneQuery } from '~/client/hooks/useCommuneQuery';
import { getSingleQueryParam } from '~/client/utils/queryParams.utils';
import { TypeEtablissement } from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';

export type AccompagnementQueryParams = {
	typeAccompagnement: TypeEtablissement | undefined;
} & CommuneQueryParams;

function isTypeEtablissement(value: string): value is TypeEtablissement {
	return Object.values(TypeEtablissement).includes(value as TypeEtablissement);
}

export function useAccompagnementQuery(): AccompagnementQueryParams {
	const { query } = useRouter();
	const communeQuery = useCommuneQuery();

	return useMemo(() => {
		const typeAccompagnement = getSingleQueryParam(query.typeAccompagnement);

		return {
			typeAccompagnement:
				typeAccompagnement && isTypeEtablissement(typeAccompagnement)
					? typeAccompagnement
					: undefined,
			...communeQuery,
		};
	}, [communeQuery, query]);
}
