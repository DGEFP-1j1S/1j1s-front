import { formatCarriageReturnToHtml } from '~/client/utils/formatCarriageReturnToHtml';

describe('formatCarriageReturnToHtml', () => {
	it('remplace les retours chariot par une balise br', () => {
		// GIVEN
		const contentWithCarriageReturn = '<p>I am a dolphin!</p>\n<p>And I like swimming</p>';

		// WHEN
		const formattedContent = formatCarriageReturnToHtml(contentWithCarriageReturn);

		// THEN
		expect(formattedContent).toBe('<p>I am a dolphin!</p><br /><p>And I like swimming</p>');
	});
});
