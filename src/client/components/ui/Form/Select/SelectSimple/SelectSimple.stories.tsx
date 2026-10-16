import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { ButtonComponent as Button } from '~/client/components/ui/Button/ButtonComponent';
import { Champ } from '~/client/components/ui/Form/Champ/Champ';

import { SelectSimple } from './SelectSimple';

const meta: Meta<typeof SelectSimple> = {
	argTypes: {
		children: {
			control: 'object',
		},
	},
	args: {
		children: ['France', 'Suisse', 'Allemagne', 'Royaume-Uni', 'Espagne', 'Belgique', 'Japon', 'Australie', 'Chine', 'Canada', 'États-Unis'],
		optionsAriaLabel: 'Pays',
	},
	component: SelectSimple,
	title: 'Components/Form/Select/SelectSimple',
};

export default meta;
type SelectProps = React.ComponentPropsWithRef<typeof SelectSimple>;
type Controls = Omit<SelectProps, 'children'> & { children: string[] };
type Story = StoryObj<Controls>;
export const exemple: Story = {
	args: {},
	render: ({ children, ...args }) => (
		<>
			<label htmlFor="pays">Pays</label>
			<SelectSimple id="pays" {...args}>
				<SelectSimple.Option value="">Aucun</SelectSimple.Option>
				{children.map((child) => <SelectSimple.Option value={child} key={child}>{child}</SelectSimple.Option>)}
			</SelectSimple>
		</>
	),
};
export const disabled: Story = {
	args: {
		disabled: true,
	},
	render: ({ children, ...args }) => (
		<>
			<label htmlFor="pays">Pays</label>
			<SelectSimple id="pays" {...args}>
				<SelectSimple.Option value="">Aucun</SelectSimple.Option>
				{children.map((child) => <SelectSimple.Option value={child} key={child}>{child}</SelectSimple.Option>)}
			</SelectSimple>
		</>
	),
};

export const validation: Story = {
	args: {
		name: 'pays',
		required: true,
	},
	render: ({ children, ...args }) => (
		<form onSubmit={(event) => {
			event.preventDefault();
			alert(Array.from(new FormData(event.currentTarget).entries()));
		}}>
			<Champ>
				<Champ.Label>Pays</Champ.Label>
				<Champ.Input render={SelectSimple} {...args}>
					<SelectSimple.Option value="">Aucun</SelectSimple.Option>
					{children.map((child) => <SelectSimple.Option value={child} key={child}>{child}</SelectSimple.Option>)}
				</Champ.Input>
				<Champ.Error />
			</Champ>
			<Button label="Envoyer" />
		</form>
	),
};

export const defaultValue: Story = {
	args: {
		defaultValue: 'France',
	},
	render: ({ children, ...args }) => (
		<>
			<label htmlFor="pays">Pays</label>
			<SelectSimple id="pays" {...args}>
				{children.map((child) => <SelectSimple.Option value={child} key={child}>{child}</SelectSimple.Option>)}
			</SelectSimple>
		</>
	),
};
