export function formatCarriageReturnToHtml(contentToFormat?: string): string {
	const lineBreaksRegex = /(?:\s*(?:\n|<br\s*\/?>)\s*)+/gi;
	if (!contentToFormat) {
		return '';
	}
	return contentToFormat.trim().replace(lineBreaksRegex, '<br />');
}
