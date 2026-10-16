import { render, screen } from '@testing-library/react';

import StageDeposerOffreFormulaireEnvoye
	from '~/client/components/features/OffreDeStage/Déposer/Confirmation/StageDeposerOffreFormulaireEnvoye';

describe('StageDeposerOffreFormulaireEnvoye', () => {
	it('affiche le message de validation', () => {
		// When
		render(<StageDeposerOffreFormulaireEnvoye />);

		// Then
		expect(screen.getByText('Cette offre est soumise à une validation avant sa mise en ligne.')).toBeVisible();
	});
	it('affiche un bouton pour déposer une nouvelle offre de stage', () => {
		// When
		render(<StageDeposerOffreFormulaireEnvoye />);

		// Then
		const link = screen.getByRole('link', { name: 'Déposer une offre de stage' });
		expect(link).toBeVisible();
		expect(link).toHaveAttribute('href', '/stages/deposer-offre');
	});
	it('affiche un bouton pour retourner à l’accueil', () => {
		// When
		render(<StageDeposerOffreFormulaireEnvoye />);

		// Then
		const link = screen.getByRole('link', { name: 'Retourner à l’accueil' });
		expect(link).toBeVisible();
		expect(link).toHaveAttribute('href', '/');
	});
});
