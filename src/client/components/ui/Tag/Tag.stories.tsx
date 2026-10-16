import type { Meta, StoryObj } from '@storybook/react';

import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
	component: Tag,
	title: 'Components/Tags/Tag',
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Example: Story = {
	args: {
		children: 'Ceci est un tag',
	},
};
