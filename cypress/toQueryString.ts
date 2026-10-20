export function toQueryString(query: Record<string, string>): string {
	return Object.entries(query)
		.map(([clé, valeur]) => `${encodeURIComponent(clé)}=${encodeURIComponent(valeur)}`)
		.join('&');
}
