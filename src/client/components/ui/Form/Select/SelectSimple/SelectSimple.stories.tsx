import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { ButtonComponent as Button } from '~/client/components/ui/Button/ButtonComponent';
import { Champ } from '~/client/components/ui/Form/Champ/Champ';

import { SelectSimple } from './SelectSimple';

const optionsList = ['France', 'Suisse', 'Allemagne', 'Royaume-Uni', 'Espagne', 'Belgique', 'Japon', 'Australie', 'Chine', 'Canada', 'États-Unis']
	.map((pays) => ({ libellé: pays, valeur: pays }));

const meta: Meta<typeof SelectSimple> = {
	args: {
		optionsList,
	},
	component: SelectSimple,
	title: 'Components/Form/Select/SelectSimple',
};

export default meta;
type Story = StoryObj<typeof SelectSimple>;

export const exemple: Story = {
	args: {},
	render: (args) => (
		<>
			<label htmlFor="pays">Pays</label>
			<SelectSimple id="pays" onChange={() => {}} {...args} />
		</>
	),
};
export const disabled: Story = {
	args: {
		disabled: true,
	},
	render: (args) => (
		<>
			<label htmlFor="pays">Pays</label>
			<SelectSimple id="pays" onChange={() => {}} {...args} />
		</>
	),
};

export const validation: Story = {
	args: {
		name: 'pays',
		required: true,
	},
	render: (args) => (
		<form onSubmit={(event) => {
			event.preventDefault();
			alert(Array.from(new FormData(event.currentTarget).entries()));
		}}>
			<Champ>
				<Champ.Label>Pays</Champ.Label>
				<Champ.Input render={SelectSimple} {...args} />
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
	render: (args) => (
		<>
			<label htmlFor="pays">Pays</label>
			<SelectSimple id="pays" onChange={() => {}} {...args} />
		</>
	),
};
