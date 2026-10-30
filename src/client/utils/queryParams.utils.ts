export function getSingleQueryParam(queryParam: string | string[] | undefined): string | undefined {
	return typeof queryParam === 'string' ? queryParam : undefined;
}

export function getArrayQueryParam(queryParam: string | string[] | undefined): string[] | undefined {
	if (!queryParam) { return undefined; }
	if (Array.isArray(queryParam)) { return queryParam; }
	return queryParam.split(',');
}

/** valeurs d‘un paramètre répété (`a=1&a=2`), sans découper sur les virgules que peuvent contenir les valeurs */
export function getValeursQueryParam(queryParam: string | string[] | undefined): string[] | undefined {
	if (!queryParam) { return undefined; }
	return Array.isArray(queryParam) ? queryParam : [queryParam];
}
