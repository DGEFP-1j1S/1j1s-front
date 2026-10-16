import type { Meta, StoryObj } from '@storybook/react';

import { FlippingCard } from './FlippingCard';

const meta: Meta<typeof FlippingCard> = {
	args: {
		category: 'Accompagnement',
		flippingCardContent: 'Les employeurs du secteur marchand qui recrutent un jeune de moins de 26 ans ou un jeune reconnu travailleur handicapé (jusqu’à 30 ans inclus) en CIE.',
		imageUrl: '/images/accompagnement.webp',
		link: 'https://www.1jeune1solution.gouv.fr/articles/aide-a-l-embauche-d-un-jeune-en-contrat-initiative-emploi-jeunes-cie-jeunes-dans-le-secteur-marchand',
		title: 'Aide à l’embauche d’un jeune en CIE',
		titleAs: 'h2',
	},
	component: FlippingCard,
	title: 'Components/Cards/FlippingCard',
};

export default meta;
type Story = StoryObj<typeof FlippingCard>;

export const Default: Story = {
	args: {

	},
};
