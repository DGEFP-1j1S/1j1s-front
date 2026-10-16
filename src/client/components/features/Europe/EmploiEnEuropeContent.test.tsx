import { render, screen } from '@testing-library/react';

import { EmploiEnEuropeContent } from './EmploiEnEuropeContent';

describe('<EmploiEnEuropeContent />', () => {
	it('affiche le titre de la page', () => {
		render(<EmploiEnEuropeContent />);

		const titrePage = screen.getByRole('heading', { name: /Je cherche une expérience en Europe/i });
		expect(titrePage).toBeVisible();
	});
	it('affiche la section de liens utiles', () => {
		render(<EmploiEnEuropeContent />);

		const liensUtiles = screen.getByRole('list', { name: /Liens utiles/i });
		expect(liensUtiles).toBeVisible();
	});
	it('affiche la section des dispositifs d’accompagnement', () => {
		render(<EmploiEnEuropeContent />);

		const accompagnements = screen.getByRole('heading', { name: /Je découvre les dispositifs pour m’accompagner dans mon projet/i });
		expect(accompagnements).toBeVisible();
	});
});
