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

	it('ne génère jamais deux balises br à la suite', () => {
		// GIVEN
		const contentWithCarriageReturns = 'I am a dolphin!\n\n\r\n  \nAnd I like swimming';

		// WHEN
		const formattedContent = formatCarriageReturnToHtml(contentWithCarriageReturns);

		// THEN
		expect(formattedContent).toBe('I am a dolphin!<br />And I like swimming');
	});

	it('fusionne les balises br déjà présentes avec les retours chariot adjacents', () => {
		// GIVEN
		const contentWithBr = 'I am a dolphin!<br>\n<BR/> <br />And I like swimming';

		// WHEN
		const formattedContent = formatCarriageReturnToHtml(contentWithBr);

		// THEN
		expect(formattedContent).toBe('I am a dolphin!<br />And I like swimming');
	});
});
