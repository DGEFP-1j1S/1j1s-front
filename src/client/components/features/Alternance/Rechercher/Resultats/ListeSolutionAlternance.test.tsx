import { render, screen, within } from '@testing-library/react';

import {
	ListeSolutionAlternance,
} from '~/client/components/features/Alternance/Rechercher/Resultats/ListeSolutionAlternance';
import { mockSmallScreen } from '~/client/components/window.mock';
import { AlternanceSource } from '~/server/alternances/domain/alternance';
import { aRechercheMatchaAlternance, aRecherchePEJobAlternance } from '~/server/alternances/domain/alternance.fixture';

describe('les tags', () => {
	beforeEach(() => {
		mockSmallScreen();
	});

	it('lorsque l‘offre est une offre france travail, je vois les tags', async () => {
		const alternancesList = [
			aRechercheMatchaAlternance({
				localisation: 'Paris',
				niveauRequis: 'débutant',
				source: AlternanceSource.MATCHA,
				typeDeContrat: ['Apprentissage', 'CDI'],
			}),
		];

		render(<ListeSolutionAlternance alternanceList={alternancesList} />);
		
		const tagsList = screen.getByRole('list', { name: 'Caractéristiques de l‘offre' });
		const tags = within(tagsList).getAllByRole('listitem');
		expect(tags).toHaveLength(4);
		expect(tags[0]).toHaveTextContent('Paris');
		expect(tags[1]).toHaveTextContent('Apprentissage');
		expect(tags[2]).toHaveTextContent('CDI');
		expect(tags[3]).toHaveTextContent('débutant');
	});

	it('lorsque l‘offre est une offre matcha, je vois les tags', async () => {
		const alternancesList = [
			aRecherchePEJobAlternance({
				localisation: 'PARIS 4',
				source: AlternanceSource.FRANCE_TRAVAIL,
				typeDeContrat: ['CDD'],
			}),
		];

		render(<ListeSolutionAlternance alternanceList={alternancesList} />);

		const tagsList = screen.getByRole('list', { name: 'Caractéristiques de l‘offre' });
		const tags = within(tagsList).getAllByRole('listitem');
		expect(tags).toHaveLength(3);
		expect(tags[0]).toHaveTextContent('PARIS 4');
		expect(tags[1]).toHaveTextContent('Contrat d‘alternance');
		expect(tags[2]).toHaveTextContent('CDD');
	});
});
