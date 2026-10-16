import { render, screen } from '@testing-library/react';

import {
	EntreprendreOutilADisposition,
} from '~/client/components/features/Entreprendre/OutilADisposition/EntreprendreOutilADisposition';

describe('<EntreprendreOutilADisposition />', () => {
	it('affiche correctement un lien', () => {
		const props = {
			description: 'description',
			link: 'https://entreprendre.com',
			linkLabel: 'linkLabel',
		};
		render(<EntreprendreOutilADisposition {...props} />);

		const link = screen.getByRole('link', { name: `${props.linkLabel} - nouvelle fenêtre` });
		expect(link).toBeVisible();
	});
});
