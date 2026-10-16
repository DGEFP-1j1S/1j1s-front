import { Meta, StoryObj } from '@storybook/react';

import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { LocalisationService } from '~/client/services/localisation/localisation.service';
import { createSuccess, Either } from '~/server/errors/either';
import { aLocalisationList } from '~/server/localisations/domain/localisation.fixture';
import { RésultatsRechercheCommune } from '~/server/localisations/domain/localisationAvecCoordonnées';
import {
	RechercheLocalisationApiResponse,
} from '~/server/localisations/infra/controllers/RechercheLocalisationApiResponse';

import { ComboboxLocalisation } from './ComboboxLocalisation';

const meta: Meta<typeof ComboboxLocalisation> = {
	argTypes: {
		debounceTimeout: {
			description: 'Temps (en ms) attendu après la dernière saisie avant de lancer la récupération des localisations',
			table: {
				defaultValue: { summary: 300 },
			},
		},
		defaultValue: {
			description: 'Valeur par défaut du combobox',
		},
		label: {
			description: 'Libellé affiché devant le combobox',
		},
	},
	args: {},
	component: ComboboxLocalisation,
	parameters: {
		docs: {
			controls: { exclude: ['onFocus', 'onChange', 'onBlur', 'onInput', 'filter', 'requireValidOption', 'valueName'] },
		},
	},
	title: 'Components/Form/Combobox/ComboboxLocalisation',
};

class LocalisationServiceStub implements LocalisationService {
	isInvalidLocalisationQuery(): boolean {
		return false;
	}
	rechercherCommune(): Promise<Either<RésultatsRechercheCommune>> {
		throw new Error('Method not implemented.');
	}
	async rechercherLocalisation(query: string): Promise<Either<RechercheLocalisationApiResponse>> {
		return new Promise((resolve) => setTimeout(() => resolve(createSuccess(
			{
				communeList: aLocalisationList().communeList.filter((commune) => commune.nom.toLowerCase().includes(query.toLowerCase())),
				departementList: aLocalisationList().departementList.filter((departement) => departement.nom.toLowerCase().includes(query.toLowerCase())),
				regionList: aLocalisationList().regionList.filter((region) => region.nom.toLowerCase().includes(query.toLowerCase())),
			},
		)), 1000));
	}
}

export default meta;
type Story = StoryObj<typeof ComboboxLocalisation>;
export const exemple: Story = {
	args: {
		debounceTimeout: 300,
	},
	render: ({ ...args }) => {
		return (
			<DependenciesProvider localisationService={new LocalisationServiceStub()}>
				<ComboboxLocalisation {...args} />
			</DependenciesProvider>
		);
	},
};

export const AvecPlaceholderEtDebounce: Story = {
	args: {
		debounceTimeout: 2000,
		placeholder: 'Exemple de placeholder',
	},
	render: ({ ...args }) => {
		return (
			<DependenciesProvider localisationService={new LocalisationServiceStub()}>
				<ComboboxLocalisation {...args} />
			</DependenciesProvider>
		);
	},
};
