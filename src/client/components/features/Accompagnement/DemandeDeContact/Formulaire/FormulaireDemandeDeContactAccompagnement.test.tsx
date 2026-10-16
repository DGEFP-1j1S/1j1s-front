import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import {
	FormulaireDemandeDeContactAccompagnement,
} from '~/client/components/features/Accompagnement/DemandeDeContact/Formulaire/FormulaireDemandeDeContactAccompagnement';
import { mockScrollIntoView, mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import {
	anEtablissementAccompagnementService,
} from '~/client/services/établissementAccompagnement/etablissementAccompagnement.fixture';
import { aLocalisationService } from '~/client/services/localisation/localisation.service.fixture';
import { aDemandeDeContactAccompagnement } from '~/server/demande-de-contact/domain/demandeDeContact.fixture';
import { createFailure, createSuccess } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { TypeÉtablissement } from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';
import {
	aContactÉtablissementAccompagnement,
} from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement.fixture';
import { aCommune } from '~/server/localisations/domain/localisationAvecCoordonnées.fixture';

describe('FormulaireDemandeDeContactAccompagnement', () => {
	beforeAll(() => {
		mockScrollIntoView();
		mockSmallScreen();
	});
	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('champ email', () => {
		it('a un champ Adresse e-mail facultatif', async () => {
			render(<DependenciesProvider
				localisationService={aLocalisationService()}
				établissementAccompagnementService={anEtablissementAccompagnementService()}>
				<FormulaireDemandeDeContactAccompagnement
					contactÉtablissementAccompagnement={aContactÉtablissementAccompagnement()}
					onSuccess={vi.fn()}
					onFailure={vi.fn()} />
			</DependenciesProvider>,
			);
			const inputEmail = screen.getByRole('textbox', { name: 'Adresse e-mail (facultatif) Exemple : jean.dupont@gmail.com' });

			await userEvent.type(inputEmail, 's{backspace}');

			expect(inputEmail).toHaveAttribute('aria-invalid', 'false');
		});

		it('ne prend pas en compte les espaces avant et après', async () => {
			// Given
			render(
				<DependenciesProvider
					localisationService={aLocalisationService()}
					établissementAccompagnementService={anEtablissementAccompagnementService()}>
					<FormulaireDemandeDeContactAccompagnement
						contactÉtablissementAccompagnement={aContactÉtablissementAccompagnement()}
						onSuccess={vi.fn()}
						onFailure={vi.fn()} />
				</DependenciesProvider>,
			);

			//When
			const inputEmail = screen.getByRole('textbox', { name: 'Adresse e-mail (facultatif) Exemple : jean.dupont@gmail.com' });
			await userEvent.type(inputEmail, '    mail@avecespace.com   ');

			// Then
			expect(inputEmail).toHaveValue('mail@avecespace.com');
		});
	});

	it('a un champ Commentaire facultatif', async () => {
		// Given
		render(
			<DependenciesProvider
				localisationService={aLocalisationService()}
				établissementAccompagnementService={anEtablissementAccompagnementService()}>
				<FormulaireDemandeDeContactAccompagnement
					contactÉtablissementAccompagnement={aContactÉtablissementAccompagnement()}
					onSuccess={vi.fn()}
					onFailure={vi.fn()} />
			</DependenciesProvider>,
		);

		//When
		const textarea = screen.getByRole('textbox', { name: 'Commentaires ou autres informations utiles (facultatif)' });
		await userEvent.type(textarea, 's{backspace}');

		// Then
		expect(textarea).toBeValid();
	});

	it('a un champ Age obligatoire', async () => {
		render(
			<DependenciesProvider
				localisationService={aLocalisationService()}
				établissementAccompagnementService={anEtablissementAccompagnementService()}>
				<FormulaireDemandeDeContactAccompagnement
					contactÉtablissementAccompagnement={aContactÉtablissementAccompagnement()}
					onSuccess={vi.fn()}
					onFailure={vi.fn()} />
			</DependenciesProvider>,
		);

		const combobox = screen.getByRole('combobox', { name: 'Age Exemple : 16 ans' });
		expect(combobox).toBeRequired();
	});

	describe('quand l’utilisateur souhaite contacter un établissement', () => {
		it('envoie une demande de contact', async () => {
			const user = userEvent.setup();
			const localisationService = aLocalisationService({
				rechercherCommune: vi.fn().mockResolvedValue(createSuccess({
					résultats: [aCommune({
						codePostal: '75006',
						ville: 'Paris',
					})],
				})),
			});
			const établissementAccompagnementService = anEtablissementAccompagnementService();
			vi.spyOn(établissementAccompagnementService, 'envoyerDemandeContact');

			render(
				<DependenciesProvider
					localisationService={localisationService}
					établissementAccompagnementService={établissementAccompagnementService}>
					<FormulaireDemandeDeContactAccompagnement
						contactÉtablissementAccompagnement={aContactÉtablissementAccompagnement()}
						onSuccess={vi.fn()}
						onFailure={vi.fn()} />
				</DependenciesProvider>,
			);

			await user.type(screen.getByRole('textbox', { name: 'Adresse e-mail (facultatif) Exemple : jean.dupont@gmail.com' }), 'john.doe@email.com');
			await user.type(screen.getByRole('textbox', { name: 'Nom Exemple : Dupont' }), 'Doe');
			await user.type(screen.getByRole('textbox', { name: 'Prénom Exemple : Jean' }), 'John');
			await user.type(screen.getByRole('textbox', { name: 'Téléphone Exemple : 0606060606' }), '0606060606');
			await user.type(screen.getByRole('textbox', { name: 'Commentaires ou autres informations utiles (facultatif)' }), 'Merci de me recontacter');

			await user.click(screen.getByRole('combobox', { name: 'Age Exemple : 16 ans' }));
			await user.click(screen.getByRole('option', { name: '23 ans' }));

			await user.type(screen.getByRole('combobox', { name: 'Localisation Exemples : Paris, Béziers…' }), 'Paris');
			await user.click(await screen.findByRole('option', { name: 'Paris (75006)' }));

			await user.click(screen.getByRole('button', { name: 'Envoyer mes informations afin d‘être rappelé(e)' }));

			expect(établissementAccompagnementService.envoyerDemandeContact).toHaveBeenCalledWith(aDemandeDeContactAccompagnement({
				age: 23,
				commentaire: 'Merci de me recontacter',
				commune: 'Paris (75006)',
				email: 'john.doe@email.com',
				nom: 'Doe',
				prénom: 'John',
				téléphone: '0606060606',
				établissement: {
					email: 'email@missionlocaledeparis.fr',
					nom: 'Mission locale pour l‘insertion professionnelle et sociale des jeunes (16-25 ans) - Paris - 1er 2e 3e 4e 9e 10e et 11e',
					type: TypeÉtablissement.MISSION_LOCALE,
				},
			}));
		});

		it('lorsque l‘envoie est un success appelle onSuccess', async () => {
			const onSuccess = vi.fn();
			const user = userEvent.setup();
			render(
				<DependenciesProvider
					localisationService={aLocalisationService()}
					établissementAccompagnementService={anEtablissementAccompagnementService()}>
					<FormulaireDemandeDeContactAccompagnement
						contactÉtablissementAccompagnement={aContactÉtablissementAccompagnement()}
						onSuccess={onSuccess}
						onFailure={vi.fn()} />
				</DependenciesProvider>,
			);

			await user.type(screen.getByRole('textbox', { name: 'Adresse e-mail (facultatif) Exemple : jean.dupont@gmail.com' }), 'john.doe@email.com');
			await user.type(screen.getByRole('textbox', { name: 'Nom Exemple : Dupont' }), 'Doe');
			await user.type(screen.getByRole('textbox', { name: 'Prénom Exemple : Jean' }), 'John');
			await user.type(screen.getByRole('textbox', { name: 'Téléphone Exemple : 0606060606' }), '0606060606');
			await user.type(screen.getByRole('textbox', { name: 'Commentaires ou autres informations utiles (facultatif)' }), 'Merci de me recontacter');

			await user.click(screen.getByRole('combobox', { name: 'Age Exemple : 16 ans' }));
			await user.click(screen.getByRole('option', { name: '23 ans' }));

			await user.type(screen.getByRole('combobox', { name: 'Localisation Exemples : Paris, Béziers…' }), 'Paris');
			await user.click(await screen.findByRole('option', { name: 'Paris (75006)' }));

			await user.click(screen.getByRole('button', { name: 'Envoyer mes informations afin d‘être rappelé(e)' }));

			expect(onSuccess).toHaveBeenCalledTimes(1);
		});

		it('lorsque l‘envoie est en erreur appelle onFailure', async () => {
			const user = userEvent.setup();
			const onFailure = vi.fn();
			const établissementAccompagnementService = anEtablissementAccompagnementService();
			render(
				<DependenciesProvider
					localisationService={aLocalisationService()}
					établissementAccompagnementService={établissementAccompagnementService}>
					<FormulaireDemandeDeContactAccompagnement
						contactÉtablissementAccompagnement={aContactÉtablissementAccompagnement()}
						onSuccess={vi.fn()}
						onFailure={onFailure} />
				</DependenciesProvider>,
			);
			vi.spyOn(établissementAccompagnementService, 'envoyerDemandeContact').mockResolvedValue(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));

			await user.type(screen.getByRole('textbox', { name: 'Nom Exemple : Dupont' }), 'Doe');
			await user.type(screen.getByRole('textbox', { name: 'Prénom Exemple : Jean' }), 'John');
			await user.type(screen.getByRole('textbox', { name: 'Téléphone Exemple : 0606060606' }), '0606060606');

			await user.click(screen.getByRole('combobox', { name: 'Age Exemple : 16 ans' }));
			await user.click(screen.getByRole('option', { name: '23 ans' }));

			await user.type(screen.getByRole('combobox', { name: 'Localisation Exemples : Paris, Béziers…' }), 'Paris');
			await user.click(await screen.findByRole('option', { name: 'Paris (75006)' }));

			await user.click(screen.getByRole('button', { name: 'Envoyer mes informations afin d‘être rappelé(e)' }));

			expect(onFailure).toHaveBeenCalledTimes(1);
		});
	});
});

