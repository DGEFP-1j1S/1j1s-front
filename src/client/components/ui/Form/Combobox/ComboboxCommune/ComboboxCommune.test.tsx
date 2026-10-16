import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { ComboboxCommune } from '~/client/components/ui/Form/Combobox/ComboboxCommune/ComboboxCommune';
import { mockScrollIntoView } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aLocalisationService } from '~/client/services/localisation/localisation.service.fixture';
import { createFailure, createSuccess } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { radiusList } from '~/server/localisations/domain/localisation';
import {
	aCommune, aCommuneList,
	aRésultatsRechercheCommune,
} from '~/server/localisations/domain/localisationAvecCoordonnées.fixture';

const MESSAGE_ERREUR_FETCH = 'Une erreur est survenue lors de la récupération des lieux. Veuillez réessayer plus tard.';
const MESSAGE_PAS_DE_RESULTAT = 'Aucune proposition ne correspond à votre saisie. Vérifiez que votre saisie correspond bien à un lieu. Exemple : Paris, ...';
const MESSAGE_CHARGEMENT = 'Chargement ...';
const MESSAGE_CHAMP_VIDE = 'Commencez à saisir au moins 3 caractères ou le code postal de la ville, puis sélectionnez votre localisation';
const DEFAULT_RADIUS_VALUE = '10';

describe('<ComboboxCommune/>', () => {
	beforeAll(() => {
		mockScrollIntoView();
	});
	it('affiche le combobox', () => {
		const localisationService = aLocalisationService();
		render(<DependenciesProvider localisationService={localisationService}><ComboboxCommune /></DependenciesProvider>);
		expect(screen.getByRole('combobox')).toBeVisible();
	});

	describe('accepte les props', () => {
		it('accepte un onChange', async () => {
			const user = userEvent.setup();
			const localisationService = aLocalisationService();
			const onChange = vi.fn();

			render(<DependenciesProvider localisationService={localisationService}>
				<ComboboxCommune label={'comboboxLabel'} onChange={onChange} />
			</DependenciesProvider>);
			const combobox = screen.getByRole('combobox', { name: 'comboboxLabel Exemples : Paris, Béziers…' });

			await user.type(combobox, 'a');

			expect(onChange).toHaveBeenCalledTimes(1);
		});

		describe('default commune', () => {
			it('accepte une default commune', () => {
				const localisationService = aLocalisationService();
				render(<DependenciesProvider localisationService={localisationService}>
					<ComboboxCommune defaultCommune={aCommune({
						code: '75056',
						codePostal: '75015',
						coordonnées: {
							latitude: 48.8,
							longitude: 2.2,
						},
						ville: 'Paris 15e Arrondissement',
					})} />
				</DependenciesProvider>);
				const combobox = screen.getByRole('combobox');

				expect(combobox).toHaveValue('Paris 15e Arrondissement (75015)');
				expect(screen.getByDisplayValue('2.2')).toBeInTheDocument();
				expect(screen.getByDisplayValue('48.8')).toBeInTheDocument();
				expect(screen.getByDisplayValue('75056')).toBeInTheDocument();
			});

			it('ajoute le libelle dans les options pour rendre l‘input valide', () => {
				const localisationService = aLocalisationService({
					rechercherCommune: vi.fn(),
				});

				const commune = aCommune({
					code: '75056',
					codePostal: '75015',
					coordonnées: {
						latitude: 48.8,
						longitude: 2.2,
					},
					ville: 'Paris 15e Arrondissement',
				});
				const communeList = aRésultatsRechercheCommune([commune]);
				vi.spyOn(localisationService, 'rechercherCommune').mockResolvedValue(createSuccess(communeList));

				render(<DependenciesProvider localisationService={localisationService}>
					<ComboboxCommune defaultCommune={commune} />
				</DependenciesProvider>);
				const combobox = screen.getByRole('combobox');

				const options = screen.getAllByRole('option', { hidden: true });
				expect(options.length).toBe(1);
				expect(options[0]).toBeInTheDocument();
				expect(options[0]).toHaveTextContent('Paris 15e Arrondissement (75015)');
				expect(combobox).toBeValid();
			});
		});

		it('accepte une distance par défaut', () => {
			const localisationService = aLocalisationService();
			const radiusExpected = radiusList[1];
			render(<DependenciesProvider localisationService={localisationService}>
				<ComboboxCommune
					defaultCommune={aCommune({
						code: '75056',
						codePostal: '75015',
						coordonnées: {
							latitude: 48.8,
							longitude: 2.2,
						},
						ville: 'Paris 15e Arrondissement',
					})}
					showRadiusInput
					defaultDistance={radiusExpected.valeur} />
			</DependenciesProvider>);

			expect(screen.getByDisplayValue(radiusList[1].valeur)).toBeInTheDocument();
		});

		it('accepte une ref', () => {
			const localisationService = aLocalisationService();
			const ref = vi.fn();

			render(<DependenciesProvider localisationService={localisationService}>
				<ComboboxCommune ref={ref} />
			</DependenciesProvider>);
			const combobox = screen.getByRole('combobox');

			expect(ref).toHaveBeenCalledTimes(1);
			expect(ref).toHaveBeenCalledWith(combobox);
		});

		it('accepte les propriétés du combobox', async () => {
			const localisationService = aLocalisationService();
			const onFocus = vi.fn();
			render(<DependenciesProvider localisationService={localisationService}>
				<ComboboxCommune onFocus={onFocus} />
			</DependenciesProvider>);
			const combobox = screen.getByRole('combobox');

			await userEvent.click(combobox);
			expect(onFocus).toHaveBeenCalledTimes(1);
		});
	});

	it('lorsque je tape un caractère, la valeur de l‘input est mise à jour', async () => {
		const user = userEvent.setup();
		const localisationService = aLocalisationService({
			rechercherCommune: vi.fn(),
		});

		render(<DependenciesProvider localisationService={localisationService}>
			<ComboboxCommune label={'comboboxLabel'} />
		</DependenciesProvider>);
		const combobox = screen.getByRole('combobox', { name: 'comboboxLabel Exemples : Paris, Béziers…' });

		await user.type(combobox, 'ab');

		expect(combobox).toHaveValue('ab');
	});

	it('par défaut, la recherche n’est lancée qu’au bout d’un certain temps après le dernier input utilisateur', async () => {
		// GIVEN
		const user = userEvent.setup();
		const localisationService = aLocalisationService();
		vi.spyOn(localisationService, 'rechercherCommune');

		render(<DependenciesProvider localisationService={localisationService}>
			<ComboboxCommune label={'commune'} />
		</DependenciesProvider>);
		const comboboxCommune = screen.getByRole('combobox', { name: 'commune Exemples : Paris, Béziers…' });

		// WHEN
		await user.type(comboboxCommune, 'Paris (750');
		await user.type(comboboxCommune, 'Paris 15');

		// THEN
		await screen.findAllByRole('option');
		expect(localisationService.rechercherCommune).toHaveBeenCalledTimes(1);
	});

	it('n‘appelle pas le service lorsque l‘utilisateur tape moins de 3 caractères', async () => {
		const user = userEvent.setup();
		const localisationService = aLocalisationService({
			rechercherCommune: vi.fn(),
		});

		render(<DependenciesProvider localisationService={localisationService}>
			<ComboboxCommune label={'comboboxLabel'} />
		</DependenciesProvider>);
		const combobox = screen.getByRole('combobox', { name: 'comboboxLabel Exemples : Paris, Béziers…' });

		await user.type(combobox, 'ab');
		await screen.findByText('Commencez à saisir au moins 3 caractères ou le code postal de la ville, puis sélectionnez votre localisation');

		expect(localisationService.rechercherCommune).not.toHaveBeenCalled();
	});

	it('n‘appelle pas le service lorsque l‘utilisateur tape moins de 3 caractères, ne prend pas en compte les espaces', async () => {
		const user = userEvent.setup();
		const localisationService = aLocalisationService({
			rechercherCommune: vi.fn(),
		});

		render(<DependenciesProvider localisationService={localisationService}>
			<ComboboxCommune label={'comboboxLabel'} />
		</DependenciesProvider>);
		const combobox = screen.getByRole('combobox', { name: 'comboboxLabel Exemples : Paris, Béziers…' });

		await user.type(combobox, '   ab   ');
		await screen.findByText('Commencez à saisir au moins 3 caractères ou le code postal de la ville, puis sélectionnez votre localisation');

		expect(localisationService.rechercherCommune).not.toHaveBeenCalled();
	});

	it.each(['(', ')', '&', '+', '#', '$'])
	('n‘appelle pas le service lorsque l‘utilisateur tape moins de 3 caractères dont un des caractères créé une erreur', async (caractereAIgnorer) => {
		const user = userEvent.setup();
		const localisationService = aLocalisationService({
			rechercherCommune: vi.fn(),
		});

		render(<DependenciesProvider localisationService={localisationService}>
			<ComboboxCommune label={'comboboxLabel'} />
		</DependenciesProvider>);
		const combobox = screen.getByRole('combobox', { name: 'comboboxLabel Exemples : Paris, Béziers…' });

		await user.type(combobox, `ab${caractereAIgnorer}`);
		await screen.findByText('Commencez à saisir au moins 3 caractères ou le code postal de la ville, puis sélectionnez votre localisation');

		expect(localisationService.rechercherCommune).not.toHaveBeenCalled();
	});

	it('n‘affiche pas l‘input de sélection du rayon par défaut', () => {
		const localisationService = aLocalisationService({
			rechercherCommune: vi.fn(),
		});
		render(<DependenciesProvider localisationService={localisationService}>
			<ComboboxCommune label={'comboboxLabel'} />
		</DependenciesProvider>);

		expect(screen.queryByRole('button', { name: 'Rayon Exemple : 30 km' })).not.toBeInTheDocument();
		expect(screen.queryByDisplayValue(DEFAULT_RADIUS_VALUE)).not.toBeInTheDocument();
	});

	describe('lorsque je fais une recherche avec au moins 3 caractères', () => {
		it('appelle le service lorsque l‘utilisateur tape 3 caractères', async () => {
			const user = userEvent.setup();
			const localisationService = aLocalisationService({
				rechercherCommune: vi.fn().mockResolvedValue(createSuccess({ résultats: aCommuneList() })),
			});

			render(<DependenciesProvider localisationService={localisationService}>
				<ComboboxCommune label={'comboboxLabel'} />
			</DependenciesProvider>);
			const combobox = screen.getByRole('combobox', { name: 'comboboxLabel Exemples : Paris, Béziers…' });

			await user.type(combobox, 'abc');

			await screen.findAllByRole('option');
			expect(localisationService.rechercherCommune).toHaveBeenCalledTimes(1);
			expect(localisationService.rechercherCommune).toHaveBeenCalledWith('abc');
		});

		it('affiche les options', async () => {
			const user = userEvent.setup();
			const communeList = aRésultatsRechercheCommune([
				aCommune({ code: '75001', codePostal: '75001', ville: 'Paris' }),
				aCommune({ code: '83000', codePostal: '83000', ville: 'Toulon' }),
			]);
			const localisationService = aLocalisationService({
				rechercherCommune: vi.fn(),
			});
			vi.spyOn(localisationService, 'rechercherCommune').mockResolvedValue(createSuccess(communeList));
			render(<DependenciesProvider localisationService={localisationService}>
				<ComboboxCommune label={'comboboxLabel'} />
			</DependenciesProvider>);
			const combobox = screen.getByRole('combobox', { name: 'comboboxLabel Exemples : Paris, Béziers…' });

			await user.type(combobox, 'abc');

			const options = await screen.findAllByRole('option');
			expect(options.length).toBe(2);
			expect(screen.getByRole('option', { name: 'Paris (75001)' })).toBeVisible();
			expect(screen.getByRole('option', { name: 'Toulon (83000)' })).toBeVisible();
		});

		describe('lorsque je sélectionne une valeur valide', () => {
			it('l‘input est valide et n‘affiche pas de message d‘erreur', async () => {
				const user = userEvent.setup();
				const messageErreur = 'Veuillez sélectionner une option dans la liste';
				const communeList = aRésultatsRechercheCommune([
					aCommune({ code: '91000', codePostal: '75001', ville: 'Paris' }),
				]);
				const localisationService = aLocalisationService({
					rechercherCommune: vi.fn(),
				});
				vi.spyOn(localisationService, 'rechercherCommune').mockResolvedValue(createSuccess(communeList));
				render(<DependenciesProvider localisationService={localisationService}>
					<ComboboxCommune label={'comboboxLabel'} />
				</DependenciesProvider>);
				const combobox = screen.getByRole('combobox', { name: 'comboboxLabel Exemples : Paris, Béziers…' });

				await user.type(combobox, 'abc');
				const parisOption = await screen.findByRole('option', { name: 'Paris (75001)' });
				await user.click(parisOption);

				expect(combobox).toBeValid();
				expect(screen.queryByText(messageErreur)).not.toBeInTheDocument();
			});

			it('met à jour la valeur du code commune', async () => {
				const user = userEvent.setup();
				const communeList = aRésultatsRechercheCommune([
					aCommune({ code: '91000', codePostal: '75001', ville: 'Paris' }),
				]);
				const localisationService = aLocalisationService({
					rechercherCommune: vi.fn(),
				});
				vi.spyOn(localisationService, 'rechercherCommune').mockResolvedValue(createSuccess(communeList));
				render(<DependenciesProvider localisationService={localisationService}>
					<ComboboxCommune label={'comboboxLabel'} />
				</DependenciesProvider>);
				const combobox = screen.getByRole('combobox', { name: 'comboboxLabel Exemples : Paris, Béziers…' });

				await user.type(combobox, 'abc');
				await user.click(await screen.findByRole('option', { name: 'Paris (75001)' }));

				const inputCode = screen.getByDisplayValue('91000');
				expect(inputCode).toBeInTheDocument();
			});

			it('met à jour la valeur de la latitude', async () => {
				const user = userEvent.setup();
				const communeList = aRésultatsRechercheCommune([
					aCommune({ codePostal: '75001', coordonnées: { latitude: 1.23, longitude: 4.56 }, ville: 'Paris' }),
				]);
				const localisationService = aLocalisationService({
					rechercherCommune: vi.fn(),
				});
				vi.spyOn(localisationService, 'rechercherCommune').mockResolvedValue(createSuccess(communeList));
				render(<DependenciesProvider localisationService={localisationService}>
					<ComboboxCommune label={'comboboxLabel'} />
				</DependenciesProvider>);
				const combobox = screen.getByRole('combobox', { name: 'comboboxLabel Exemples : Paris, Béziers…' });

				await user.type(combobox, 'abc');
				await user.click(await screen.findByRole('option', { name: 'Paris (75001)' }));

				const inputCode = screen.getByDisplayValue('1.23');
				expect(inputCode).toBeInTheDocument();
			});

			it('met à jour la valeur de la longitude', async () => {
				const user = userEvent.setup();
				const communeList = aRésultatsRechercheCommune([
					aCommune({ codePostal: '75001', coordonnées: { latitude: 1.23, longitude: 4.56 }, ville: 'Paris' }),
				]);
				const localisationService = aLocalisationService({
					rechercherCommune: vi.fn(),
				});
				vi.spyOn(localisationService, 'rechercherCommune').mockResolvedValue(createSuccess(communeList));
				render(<DependenciesProvider localisationService={localisationService}>
					<ComboboxCommune label={'comboboxLabel'} />
				</DependenciesProvider>);
				const combobox = screen.getByRole('combobox', { name: 'comboboxLabel Exemples : Paris, Béziers…' });

				await user.type(combobox, 'abc');
				await user.click(await screen.findByRole('option', { name: 'Paris (75001)' }));

				const inputCode = screen.getByDisplayValue('4.56');
				expect(inputCode).toBeInTheDocument();
			});

			it('met à jour la valeur de la ville', async () => {
				const user = userEvent.setup();
				const communeList = aRésultatsRechercheCommune([
					aCommune({ codePostal: '75019', ville: 'Paris' }),
				]);
				const localisationService = aLocalisationService();
				vi.spyOn(localisationService, 'rechercherCommune').mockResolvedValue(createSuccess(communeList));
				render(<DependenciesProvider localisationService={localisationService}>
					<ComboboxCommune label={'comboboxLabel'} />
				</DependenciesProvider>);
				const combobox = screen.getByRole('combobox', { name: 'comboboxLabel Exemples : Paris, Béziers…' });

				await user.type(combobox, 'abc');
				await user.click(await screen.findByText('Paris (75019)'));

				const inputCode = screen.getByDisplayValue('Paris');
				expect(inputCode).toBeInTheDocument();
			});

			it('met à jour la valeur du code postal', async () => {
				const user = userEvent.setup();
				const communeList = aRésultatsRechercheCommune([
					aCommune({ codePostal: '75006', ville: 'Paris' }),
				]);
				const localisationService = aLocalisationService();
				vi.spyOn(localisationService, 'rechercherCommune').mockResolvedValue(createSuccess(communeList));
				render(<DependenciesProvider localisationService={localisationService}>
					<ComboboxCommune label={'comboboxLabel'} />
				</DependenciesProvider>);
				const combobox = screen.getByRole('combobox', { name: 'comboboxLabel Exemples : Paris, Béziers…' });

				await user.type(combobox, 'abc');
				await user.click(await screen.findByRole('option', { name: 'Paris (75006)' }));

				const inputCode = screen.getByDisplayValue('75006');
				expect(inputCode).toBeInTheDocument();
			});

			describe('selection du radius', () => {
				it('affiche le bouton de sélection du radius avec sa valeur par default', async () => {
					const user = userEvent.setup();
					const communeList = aRésultatsRechercheCommune([
						aCommune({ codePostal: '75001', coordonnées: { latitude: 1.23, longitude: 4.56 }, ville: 'Paris' }),
					]);
					const localisationService = aLocalisationService({
						rechercherCommune: vi.fn(),
					});
					vi.spyOn(localisationService, 'rechercherCommune').mockResolvedValue(createSuccess(communeList));
					render(<DependenciesProvider localisationService={localisationService}>
						<ComboboxCommune label={'comboboxLabel'} showRadiusInput />
					</DependenciesProvider>);
					const combobox = screen.getByRole('combobox', { name: 'comboboxLabel Exemples : Paris, Béziers…' });

					await user.type(combobox, 'abc');
					await user.click(await screen.findByRole('option', { name: 'Paris (75001)' }));

					expect(screen.getByRole('combobox', { name: 'Rayon Exemple : 30 km' })).toBeVisible();
					expect(screen.getByDisplayValue(DEFAULT_RADIUS_VALUE)).toBeInTheDocument();
				});

				it('quand on sélectionne un rayon, le rayon est sélectionné', async () => {
					const user = userEvent.setup();
					const radiusToSelect = radiusList[1];
					const communeList = aRésultatsRechercheCommune([
						aCommune({ codePostal: '75001', coordonnées: { latitude: 1.23, longitude: 4.56 }, ville: 'Paris' }),
					]);
					const localisationService = aLocalisationService({
						rechercherCommune: vi.fn(),
					});
					vi.spyOn(localisationService, 'rechercherCommune').mockResolvedValue(createSuccess(communeList));
					render(<DependenciesProvider localisationService={localisationService}>
						<ComboboxCommune label={'comboboxLabel'} showRadiusInput />
					</DependenciesProvider>);
					const combobox = screen.getByRole('combobox', { name: 'comboboxLabel Exemples : Paris, Béziers…' });

					await user.type(combobox, 'abc');
					await user.click(await screen.findByRole('option', { name: 'Paris (75001)' }));

					const rayonSelect = screen.getByRole('combobox', { name: 'Rayon Exemple : 30 km' });
					await user.click(rayonSelect);
					await user.click(screen.getByRole('option', { name: radiusToSelect.libellé }));

					expect(screen.getByDisplayValue(radiusToSelect.valeur)).toBeInTheDocument();
				});
			});

			it('lorsque le combobox est invalide après avoir été valide, le bouton de sélection du rayon n‘apparait pas', async () => {
				const user = userEvent.setup();
				const communeList = aRésultatsRechercheCommune([
					aCommune({ codePostal: '75006', coordonnées: { latitude: 1.23, longitude: 4.56 }, ville: 'Paris' }),
				]);
				const localisationService = aLocalisationService({
					rechercherCommune: vi.fn(),
				});
				vi.spyOn(localisationService, 'rechercherCommune').mockResolvedValue(createSuccess(communeList));
				render(<DependenciesProvider localisationService={localisationService}>
					<ComboboxCommune required />
				</DependenciesProvider>);
				const combobox = screen.getByRole('combobox');

				await user.type(combobox, 'abc');
				await user.click(await screen.findByRole('option', { name: 'Paris (75006)' }));
				await user.tab();

				await user.clear(combobox);

				expect(screen.queryByRole('button', { name: 'Rayon Exemple : 30 km' })).not.toBeInTheDocument();
			});

			it('lorsque le combobox est vide et optionel, n‘affiche pas le bouton rayon', async () => {
				const user = userEvent.setup();
				const communeList = aRésultatsRechercheCommune([
					aCommune({ codePostal: '75001', coordonnées: { latitude: 1.23, longitude: 4.56 }, ville: 'Paris' }),
				]);
				const localisationService = aLocalisationService({
					rechercherCommune: vi.fn(),
				});
				vi.spyOn(localisationService, 'rechercherCommune').mockResolvedValue(createSuccess(communeList));
				render(<DependenciesProvider localisationService={localisationService}>
					<ComboboxCommune />
				</DependenciesProvider>);
				const combobox = screen.getByRole('combobox');

				await user.type(combobox, 'abc');
				await user.clear(combobox);

				expect(screen.queryByRole('button', { name: 'Rayon Exemple : 30 km' })).not.toBeInTheDocument();
			});
		});

		describe('lorsque je ne sélectionne pas une valeur valide', () => {
			it('l‘input est en erreur et affiche le message d‘erreur', async () => {
				const user = userEvent.setup();
				const messageErreur = 'Veuillez sélectionner une option dans la liste';
				render(
					<DependenciesProvider localisationService={aLocalisationService()}>
						<ComboboxCommune />
					</DependenciesProvider>,
				);

				const combobox = screen.getByRole('combobox');
				await user.type(combobox, 'ABCE');
				await user.tab();

				expect(combobox).toHaveAttribute('aria-invalid', 'true');
				expect(screen.getByText(messageErreur)).toBeVisible();
			});
		});
	});

	describe('Message d‘asynchronisme', () => {
		it('affiche le message d‘aide quand il a interagit avec le champ', async () => {
			const user = userEvent.setup();
			const communeList = aRésultatsRechercheCommune();
			const localisationService = aLocalisationService({
				rechercherCommune: vi.fn(),
			});
			vi.spyOn(localisationService, 'rechercherCommune').mockResolvedValue(createSuccess(communeList));


			render(<DependenciesProvider localisationService={localisationService}>
				<ComboboxCommune label={'comboboxLabel'} />
			</DependenciesProvider>);

			const combobox = screen.getByRole('combobox', { name: 'comboboxLabel Exemples : Paris, Béziers…' });
			await user.type(combobox, 'ab');

			expect(screen.getByRole('status')).toHaveTextContent(MESSAGE_CHAMP_VIDE);
		});

		it('affiche le message de chargement quand les résultats sont en train de charger', async () => {
			const user = userEvent.setup();
			const localisationService = aLocalisationService({
				rechercherCommune: vi.fn(),
			});
			vi.spyOn(localisationService, 'rechercherCommune').mockReturnValue(new Promise(() => {
			}));


			render(<DependenciesProvider localisationService={localisationService}>
				<ComboboxCommune label={'comboboxLabel'} />
			</DependenciesProvider>);

			const combobox = screen.getByRole('combobox', { name: 'comboboxLabel Exemples : Paris, Béziers…' });
			await user.type(combobox, 'abc');

			expect(screen.getByRole('status')).toHaveTextContent(MESSAGE_CHARGEMENT);
		});

		it('affiche le message d‘erreur quand la recherche a échouée', async () => {
			const user = userEvent.setup();
			const localisationService = aLocalisationService({
				rechercherCommune: vi.fn(),
			});
			vi.spyOn(localisationService, 'rechercherCommune').mockResolvedValue(createFailure(ErreurMetier.CONTENU_INDISPONIBLE));


			render(<DependenciesProvider localisationService={localisationService}>
				<ComboboxCommune label={'comboboxLabel'} debounceTimeout={0} />
			</DependenciesProvider>);

			const combobox = screen.getByRole('combobox', { name: 'comboboxLabel Exemples : Paris, Béziers…' });
			await user.type(combobox, 'abc');

			expect(screen.getByRole('status')).toHaveTextContent(MESSAGE_ERREUR_FETCH);
		});

		it('affiche le message pas de résultat quand il n‘y a pas de résultat', async () => {
			const user = userEvent.setup();
			const communeList = aRésultatsRechercheCommune([]);
			const localisationService = aLocalisationService({
				rechercherCommune: vi.fn(),
			});
			vi.spyOn(localisationService, 'rechercherCommune').mockResolvedValue(createSuccess(communeList));


			render(<DependenciesProvider localisationService={localisationService}>
				<ComboboxCommune label={'comboboxLabel'} debounceTimeout={0} />
			</DependenciesProvider>);

			const combobox = screen.getByRole('combobox', { name: 'comboboxLabel Exemples : Paris, Béziers…' });
			await user.type(combobox, 'abc');

			expect(screen.getByRole('status')).toHaveTextContent(MESSAGE_PAS_DE_RESULTAT);
		});

		it('n‘affiche pas de message quand la recherche est en succès avec des résultats', async () => {
			const user = userEvent.setup();
			const communeList = aRésultatsRechercheCommune();
			const localisationService = aLocalisationService({
				rechercherCommune: vi.fn(),
			});
			vi.spyOn(localisationService, 'rechercherCommune').mockResolvedValue(createSuccess(communeList));


			render(<DependenciesProvider localisationService={localisationService}>
				<ComboboxCommune label={'comboboxLabel'} debounceTimeout={0} />
			</DependenciesProvider>);

			const combobox = screen.getByRole('combobox', { name: 'comboboxLabel Exemples : Paris, Béziers…' });
			await user.type(combobox, 'abc');

			expect(screen.getByRole('status')).toHaveTextContent(/^$/);
		});
	});
});
