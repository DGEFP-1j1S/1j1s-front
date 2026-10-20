import type { Meta, StoryObj } from '@storybook/react';

import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import {
	anEtablissementAccompagnementService,
} from '~/client/services/etablissementAccompagnement/etablissementAccompagnement.fixture';
import { aLocalisationService } from '~/client/services/localisation/localisation.service.fixture';
import {
	anEtablissementAccompagnement,
	anEtablissementAccompagnementFranceTravail,
	anEtablissementAccompagnementInfoJeunes,
	anEtablissementAccompagnementMissionLocale,
} from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement.fixture';

import { ResultatRechercherAccompagnement } from './ResultatRechercherAccompagnement';

const meta: Meta<typeof ResultatRechercherAccompagnement> = {
	args: {
		etablissement: anEtablissementAccompagnement(),
	},
	component: ResultatRechercherAccompagnement,
	render: (args) => {
		return (
			<DependenciesProvider
				établissementAccompagnementService={anEtablissementAccompagnementService()}
				localisationService={aLocalisationService()}>
				<ResultatRechercherAccompagnement {...args} />
			</DependenciesProvider>
		);
	},
	title: 'Components/Feature/RésultatRechercherAccompagnement',
};

export default meta;
type Story = StoryObj<typeof ResultatRechercherAccompagnement>;

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
