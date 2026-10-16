export function formatCarriageReturnToHtml(contentToFormat?: string): string {
	const carriageReturnRegex = new RegExp('\\n', 'g');
	if (!contentToFormat) {
		return '';
	}
	return contentToFormat.trim().replace(carriageReturnRegex, '<br />');
}
