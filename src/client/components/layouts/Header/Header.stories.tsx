import type { Meta,StoryObj } from '@storybook/react';

import { Header } from './Header';

const meta:Meta<typeof Header>={
	component:Header,
	title:'Components/Header',
    
};
export default meta;
type Story = StoryObj<typeof Header>;

export const Example:Story={
	args:{
		href:'https://www.1jeune1solution.gouv.fr/',
		role:'banner',
	},
};


