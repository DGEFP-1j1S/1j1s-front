import type { Meta, StoryObj } from '@storybook/react';

import SkipLink from './SkipLink';

const meta: Meta<typeof SkipLink> = {
	component: SkipLink,
	title: 'Components/SkipLink',
};

export default meta;
type Story = StoryObj<typeof SkipLink>;

export const Example: Story = {
	render: () => (
		<>
			<SkipLink />
			<p>Cliquez ici puis appuyez sur `Tab` pour faire apparaitre les liens d‘évitement</p>
		</>
	),
};

