import { render, screen } from '@testing-library/react';

import DecouvrirMesuresEmployeursEtApprentissage
	from '~/client/components/features/JeRecrute/DecouvrirMesuresEmployeursEtApprentissage/DecouvrirMesuresEmployeursEtApprentissage';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';

describe('DecouvrirMesuresEmployeursEtApprentissage', () => {

	function renderComponent () {
		render(
			<DependenciesProvider>
				<DecouvrirMesuresEmployeursEtApprentissage />
			</DependenciesProvider>,
		);

	}
	describe('affiche le composant', () => {
		it('affiche les titres du plan 1j1s', () => {
			// Given
			const titre = 'Découvrez les mesures du plan 1jeune1solution pour vous aider à recruter plus facilement';

			renderComponent();

			// Then
			expect(screen.getByRole('heading', { level: 2, name: titre })).toBeInTheDocument();
		});
		it('affiche les titres sur l’apprentissage', () => {
			// Given
			const titre = 'Découvrez l’apprentissage, le bon choix pour votre entreprise';

			renderComponent();

			// Then
			expect(screen.getByRole('heading', { level: 2, name: titre })).toBeInTheDocument();
		});
	});
	describe('quand on clique sur Découvrir toutes les mesures employeurs', () => {
		it('on est renvoyé vers la page Mesures Employeurs', () => {
			// Given
			const boutonDécouvrir = 'Découvrir les mesures employeurs';

			renderComponent();

			// Then
			const link = screen.getByRole('link', { name: boutonDécouvrir });
			expect(link).toBeInTheDocument();
			expect(link).toHaveAttribute('href', expect.stringContaining('/mesures-employeurs'));
		});
	});
	describe('quand on clique sur Découvrir l’apprentissage', () => {
		it('on est renvoyé vers la landing recruteurs LBA en nouvelle fenêtre', () => {
			// Given
			const boutonDécouvrir = 'Découvrir l’apprentissage - nouvelle fenêtre';

			renderComponent();

			// Then
			const link = screen.getByRole('link', { name: boutonDécouvrir });
			expect(link).toBeInTheDocument();
			expect(link).toHaveAttribute('href', expect.stringContaining('1jeune1solution-recruteurs'));
		});
	});
});
