import type { Meta, StoryObj } from '@storybook/react';

import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import {
	anEtablissementAccompagnementService,
} from '~/client/services/établissementAccompagnement/etablissementAccompagnement.fixture';
import { aLocalisationService } from '~/client/services/localisation/localisation.service.fixture';
import {
	anEtablissementAccompagnement,
	anEtablissementAccompagnementFranceTravail,
	anEtablissementAccompagnementInfoJeunes,
	anEtablissementAccompagnementMissionLocale,
} from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement.fixture';

import { RésultatRechercherAccompagnement } from './RésultatRechercherAccompagnement';

const meta: Meta<typeof RésultatRechercherAccompagnement> = {
	args: {
		etablissement: anEtablissementAccompagnement(),
	},
	component: RésultatRechercherAccompagnement,
	render: (args) => {
		return (
			<DependenciesProvider
				établissementAccompagnementService={anEtablissementAccompagnementService()}
				localisationService={aLocalisationService()}>
				<RésultatRechercherAccompagnement {...args} />
			</DependenciesProvider>
		);
	},
	title: 'Components/Feature/RésultatRechercherAccompagnement',
};

export default meta;
type Story = StoryObj<typeof RésultatRechercherAccompagnement>;

export const MissionLocale: Story = {
	args: {
		etablissement: anEtablissementAccompagnementMissionLocale(),
	},
};
export const MissionLocaleSansEmail: Story = {
	args: {
		etablissement: anEtablissementAccompagnementMissionLocale({ email: undefined }),
	},
};
export const InfoJeune: Story = {
	args: {
		etablissement: anEtablissementAccompagnementInfoJeunes(),
	},
};
export const FranceTravail: Story = {
	args: {
		etablissement: anEtablissementAccompagnementFranceTravail(),
	},
};
