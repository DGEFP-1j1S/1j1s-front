import { render, screen } from '@testing-library/react';

import { ServiceCard, ServiceCardList } from '~/client/components/features/ServiceCard/Card/ServiceCard';

describe('ServiceCardList', () => {
	it('lorsque je donne un ariaLabel, il est positionné sur la list d‘élément', () => {
		render(<ServiceCardList aria-label={'Le nom accessible de la liste'}>
			<div>Element</div>
		</ServiceCardList>);

		expect(screen.getByRole('list', { name: 'Le nom accessible de la liste' })).toBeVisible();
	});
});

describe('ServiceCard', () => {
	it('si aucune alternative textuelle au logo n‘est fournie, le logo a une alternative textuelle vide', () => {
		render(<ServiceCard link="/par-ici" linkLabel="Par là" logo="/image.jpg" title="Mon nouveau service" titleAs="h1">Wow
			ce service est incroyable</ServiceCard>);

		const logo = screen.getByRole('presentation');

		expect(logo).toHaveAttribute('alt', '');
	});

	it('si une alternative textuelle au logo est fournie, le logo l‘utilise', () => {
		render(<ServiceCard link="/par-ici"
			linkLabel="Par là"
			logo="/image.jpg"
			logoAlt="Service Plus, le service des pros"
			title="Mon nouveau service"
			titleAs="h1">Wow ce service est incroyable</ServiceCard>);

		const logo = screen.getByRole('img');

		expect(logo).toHaveAttribute('alt', 'Service Plus, le service des pros');
	});
});
