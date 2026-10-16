import { act, render, screen } from '@testing-library/react';
import { RefObject } from 'react';

import Bouée from '~/client/components/ui/Bouée/Bouée';

const LABEL_BOUEE = 'Remonter en haut de la page';
const DEBOUNCE_DELAY = 50;

describe('<Bouée />', () => {
	afterEach(() => vi.resetAllMocks());
	beforeEach(() => {
		window.scrollTo = vi.fn().mockImplementation(() => {
			window.dispatchEvent(new Event('scroll'));
		});
	});

	function mockSurface (initialY = 20): [RefObject<HTMLElement>, (y: number) => void] {
		let y = initialY;
		const surface = {
			getBoundingClientRect: vi.fn(() => ({ y } as DOMRect)),
		};
		const surfaceRef: RefObject<HTMLElement> = { current: surface as unknown as HTMLElement };
		const setY = (n: number) => { y=n; };
		return [surfaceRef, setY];
	}

	describe('quand l‘utilisateur est en haut de la page', () => {
		it('masque le lien', () => {
			// Given
			const [surfaceRef] = mockSurface();

			// When
			render(<Bouée surface={ surfaceRef } />);
			
			// Then
			const link = screen.queryByRole('link', { hidden: true, name: LABEL_BOUEE });
			expect(link).not.toBeInTheDocument();
		});

		describe('quand on scroll vers le bas', () => {
			it('affiche le lien', async () => {
				// Given
				const [surfaceRef, setY] = mockSurface();

				// When
				render(<Bouée surface={ surfaceRef } />);
				setY(-100);
				await act(async () => {
					window.scrollTo({ top: 200 });
					await delay(DEBOUNCE_DELAY);
				});
				
				// Then
				const link = screen.getByRole('link', { name: LABEL_BOUEE });
				expect(link).toBeVisible();
			});

			describe('quand on clique sur le lien', () => {
				it('remonte jusqu‘en haut de la page', async () => {
					// Given
					const [ surfaceRef, setY] = mockSurface();

					// When
					render(<Bouée surface={ surfaceRef } />);
					setY(-100);
					await act(async () => {
						window.scrollTo({ top: 200 });
						await delay(DEBOUNCE_DELAY);
					});

					const link = screen.getByRole('link', { name: LABEL_BOUEE });

					// Then
					expect(link).toHaveAttribute('href', '#top');
				});
			});
		});
	});

	describe('quand l‘élement étalon n‘est plus visible', () => {
		it('affiche un lien visible', async () => {
			// Given
			const [surfaceRef] = mockSurface(-100);

			// When
			render(<Bouée surface={ surfaceRef } />);
			await act(() => delay(DEBOUNCE_DELAY));

			// Then
			const link = screen.getByRole('link', { name: LABEL_BOUEE });

			expect(link).toBeVisible();
		});
	});
});


function delay (ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
