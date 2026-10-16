import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { FlippingCard } from '~/client/components/ui/Card/Flipping/FlippingCard';
import { mockUseRouter } from '~/client/components/useRouter.mock';

describe('<FlippingCard>', () => {
	beforeEach(() => mockUseRouter({}));
	it('utilise le formalisme markdown pour "pour qui"', async () => {
		// Given
		const pourQui = 'ceci est le texte de **pour qui**';
		const user = userEvent.setup();
		// When
		render(<FlippingCard link="/coucou" title="test" imageUrl="/test.img" flippingCardContent={ pourQui } />);

		const button = screen.getByRole('button', { name: 'Pour qui ?' });
		await user.click(button);

		// Then
		expect(screen.getByText('pour qui').tagName).toEqual('STRONG');
	});

	it('utilise une image par défaut lorsqu’il n’y a pas d’image fournie', async () => {
		// When
		render(<FlippingCard link="/coucou" title="test" flippingCardContent="pour qui" />);

		// Then
		const image = screen.getByRole('presentation');
		expect(image).toHaveAttribute('src', expect.stringContaining('image-par-defaut-carte.webp'));
	});

	it('cache le lien lorsqu’il n’est pas fourni', async () => {
	  // When
	  render(<FlippingCard title="test" flippingCardContent="pour qui" />);

	  // Then
	 expect(screen.queryByRole('link')).not.toBeInTheDocument();
	});
});
