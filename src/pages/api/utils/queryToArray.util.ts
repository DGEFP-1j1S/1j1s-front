export function queryToArray(query: string | Array<string>, separator = ','): Array<string> {
	if (Array.isArray(query)) {
		return query;
	}
	return query.split(separator);
}

/** valeurs d‘un paramètre répété (`a=1&a=2`), sans découper sur les virgules que peuvent contenir les valeurs */
export function queryToValeurs(query: string | Array<string>): Array<string> {
	return Array.isArray(query) ? query : [query];
}
