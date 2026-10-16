import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { Header } from '~/client/components/layouts/Header/Header';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockLargeScreen, mockSmallScreen } from '~/client/components/window.mock';

describe('Header', () => {
	describe('Sur desktop', () => {
		beforeEach(() => {
			mockLargeScreen();
		});
		afterEach(() => {
			vi.clearAllMocks();
		});
		it('affiche le composant Header', async () => {
			mockUseRouter({ pathname: '/' });
			render(<Header />);

			const header = screen.getByRole('banner');
			expect(header).toBeVisible();
		});

		it('affiche le logo du ministère', () => {
			mockUseRouter({ pathname: '/' });
			const { container } = render(<Header />);

			// eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
			const logo = container.getElementsByClassName('fr-logo')[0];
			expect(logo).toBeVisible();
			expect(logo.innerHTML).toContain('Ministère');
			expect(logo.innerHTML).toContain('du Travail');
			expect(logo.innerHTML).toContain('et des solidarités');
		});

		it('affiche un lien vers l’accueil', () => {
			mockUseRouter({ pathname: '/' });
			render(<Header />);

			const accueilLink = screen.getByRole('link', { name: '1jeune1solution (retour à l\'accueil)' });
			expect(accueilLink).toBeVisible();
		});

		describe('quand on ouvre la navigation', () => {
			it('affiche la navigation avec le role correspondant', async () => {
				const user = userEvent.setup();
				mockUseRouter({ pathname: '/' });
				render(<Header />);

				const header = screen.getByRole('banner');
				const openNavButton = within(header).getByRole('button', { name: 'Offres' });
				await user.click(openNavButton);
				const navigationDesktop = screen.getByTestId('navigation-desktop');

				expect(navigationDesktop).toHaveRole('navigation');
				expect(navigationDesktop).toBeVisible();
			});

			it('affiche le lien "Découvrir et trouver sa voie avec l’apprentissage" dans le menu des formations et orientations', async () => {
				// GIVEN
				mockUseRouter({ pathname: '/' });
				render(<Header />);
				const navigationDesktop = screen.getByTestId('navigation-desktop');
				const formationsEtOrientationNavItem = within(navigationDesktop).getByRole('button', { name: /^formations et orientation$/i });
				const user = userEvent.setup();

				// WHEN
				await user.click(formationsEtOrientationNavItem);

				// THEN
				const campagneApprentissageLink = screen.getByRole('link', { name: 'Découvrir et trouver sa voie avec l’apprentissage - nouvelle fenêtre' });
				expect(campagneApprentissageLink).toBeVisible();
			});
		});

		describe('quand la page courante est "Accueil"', () => {
			it('affiche le composant Header avec la navigation active sur "Accueil"', async () => {
				mockUseRouter({ pathname: '/' });
				render(<Header />);

				const navigationDesktop = screen.getByTestId('navigation-desktop');
				const accueilNavItem = within(navigationDesktop).getByText('Accueil');
				const offresNavItem = within(navigationDesktop).getByText('Offres');


				expect(accueilNavItem).toHaveAttribute('aria-current', 'true');
				expect(offresNavItem).toHaveAttribute('aria-current', 'false');
			});
		});

		describe('quand la page courante est "Emplois"', () => {
			it('affiche le composant Header avec la navigation active sur "Emplois"', async () => {
				const user = userEvent.setup();
				mockUseRouter({ pathname: '/emplois' });
				render(<Header />);

				const navigationDesktop = screen.getByTestId('navigation-desktop');
				const accueilNavItem = within(navigationDesktop).getByText('Accueil');
				const offresNavItem = within(navigationDesktop).getByText('Offres');

				await user.click(offresNavItem);

				const emploisNavItem = within(navigationDesktop).getByText('Emplois');

				expect(accueilNavItem).toHaveAttribute('aria-current', 'false');
				expect(emploisNavItem).toHaveAttribute('aria-current', 'true');
			});
		});

		describe('quand la fonctionnalité de campagne de com est activée', () => {
			it('affiche le composant Header avec l’encart', async () => {
				// Given
				process.env = {
					...process.env,
					NEXT_PUBLIC_CAMPAGNE_COM_EN_COURS_FEATURE: '1',
				};
				mockUseRouter({ pathname: '/' });

				// When
				render(<Header />);

				// Then
				const encartCampagne = screen.getByTestId('desktop-encart-campagne');
				expect(encartCampagne).toBeVisible();
				expect(encartCampagne).toHaveRole('link');
			});
		});

		describe('quand la fonctionnalité de campagne de com est désactivée', () => {
			it('affiche le composant Header sans l’encart', async () => {
				// Given
				process.env = {
					...process.env,
					NEXT_PUBLIC_CAMPAGNE_COM_EN_COURS_FEATURE: '0',
				};
				mockUseRouter({ pathname: '/' });

				// When
				render(<Header />);

				// Then
				const encartCampagne = screen.queryByTestId('desktop-encart-campagne');
				expect(encartCampagne).not.toBeInTheDocument();
			});
		});

		it('affiche le lien jobs d‘été quand le feature flip est actif', async () => {
			// GIVEN
			mockUseRouter({ pathname: '/' });
			process.env.NEXT_PUBLIC_JOB_ETE_FEATURE = '1';
			render(<Header />);
			const offreNavItem = screen.getByRole('button', { name: /^Offres$/i });
			const user = userEvent.setup();

			// WHEN
			await user.click(offreNavItem);

			// THEN
			const jobsEteLink = screen.getByRole('link', { name: 'Jobs d‘été' });
			expect(jobsEteLink).toBeVisible();
			expect(jobsEteLink).toHaveAttribute('href', '/jobs-ete');
		});
		it('masque le lien jobs d‘été quand le feature flip est inactif', async () => {
			// GIVEN
			mockUseRouter({ pathname: '/' });
			process.env.NEXT_PUBLIC_JOB_ETE_FEATURE = '0';
			render(<Header />);
			const offreNavItem = screen.getByRole('button', { name: /^Offres$/i });
			const user = userEvent.setup();

			// WHEN
			await user.click(offreNavItem);

			// THEN
			const jobsEteLink = screen.queryByRole('link', { name: 'Jobs d‘été' });
			expect(jobsEteLink).not.toBeInTheDocument();
		});
		it('affiche le lien stage de 2de quand le feature flip est actif', async () => {
			// GIVEN
			mockUseRouter({ pathname: '/' });
			process.env.NEXT_PUBLIC_STAGES_SECONDE_RECHERCHE_FEATURE = '1';
			process.env.NEXT_PUBLIC_STAGES_SECONDE_URL = 'https://www.monstageenligne.example/';
			render(<Header />);
			const offreNavItem = screen.getByRole('button', { name: /^Offres$/i });
			const user = userEvent.setup();

			// WHEN
			await user.click(offreNavItem);

			// THEN
			const stage2deLink = screen.getByRole('link', { name: 'Stages d’observation - nouvelle fenêtre' });
			expect(stage2deLink).toBeVisible();
			expect(stage2deLink).toHaveAttribute('href', 'https://www.monstageenligne.example/');
		});
		it('masque le lien stage de 2de quand le feature flip est inactif', async () => {
			// GIVEN
			mockUseRouter({ pathname: '/' });
			process.env.NEXT_PUBLIC_STAGES_SECONDE_RECHERCHE_FEATURE = '0';
			process.env.NEXT_PUBLIC_STAGES_SECONDE_URL = 'https://www.monstageenligne.example/';
			render(<Header />);
			const offreNavItem = screen.getByRole('button', { name: /^Offres$/i });
			const user = userEvent.setup();

			// WHEN
			await user.click(offreNavItem);

			// THEN
			const stage2deLink = screen.queryByRole('link', { name: 'Stages d’observation - nouvelle fenêtre' });
			expect(stage2deLink).not.toBeInTheDocument();
		});
		it('masque le lien stage de 2de quand l’url n’est pas fournie', async () => {
			// GIVEN
			mockUseRouter({ pathname: '/' });
			process.env.NEXT_PUBLIC_STAGES_SECONDE_RECHERCHE_FEATURE = '1';
			process.env.NEXT_PUBLIC_STAGES_SECONDE_URL = '';
			render(<Header />);
			const offreNavItem = screen.getByRole('button', { name: /^Offres$/i });
			const user = userEvent.setup();

			// WHEN
			await user.click(offreNavItem);

			// THEN
			const stage2deLink = screen.queryByRole('link', { name: 'Stages d’observation - nouvelle fenêtre' });
			expect(stage2deLink).not.toBeInTheDocument();
		});
		describe('quand l’enquête de satisfaction est feature flippé', () => {
			it('ON, affiche le lien vers l’enquête de satisfaction', () => {
				// GIVEN
				mockUseRouter({ pathname: '/' });
				process.env.NEXT_PUBLIC_CAMPAGNE_COM_EN_COURS_FEATURE = '1';
				process.env.NEXT_PUBLIC_ENQUETE_SATISFACTION_FEATURE = '1';

				// WHEN
				render(<Header />);

				// THEN
				const lienEnquete = screen.getByRole('link', { name: "Vous souhaitez aider 1jeune1solution à s'améliorer ? Donnez votre avis en moins de 2 minutes - nouvelle fenêtre" });
				expect(lienEnquete).toBeVisible();
				expect(lienEnquete).toHaveAttribute('href', 'https://jedonnemonavis.numerique.gouv.fr/Demarches/4085?button=4514');
			});


			it('OFF, masque le lien vers l’enquête de satisfaction', () => {
				// GIVEN
				mockUseRouter({ pathname: '/' });
				process.env.NEXT_PUBLIC_ENQUETE_SATISFACTION_FEATURE = '0';

				// WHEN
				render(<Header />);

				// THEN
				const lienEnquete = screen.queryByRole('link', { name: "Vous souhaitez aider 1jeune1solution à s'améliorer ? Donnez votre avis en moins de 2 minutes" });
				expect(lienEnquete).not.toBeInTheDocument();
			});
		});
	});

	describe('Sur mobile', () => {
		beforeEach(() => {
			mockSmallScreen();
		});
		afterEach(() => {
			vi.clearAllMocks();
		});
		describe('Par défaut', () => {
			it('n‘affiche pas la navigation mobile', () => {
				mockUseRouter({ pathname: '/' });
				render(<Header />);
				const menu = screen.queryByRole('navigation', { name: 'menu principal' });
				expect(menu).not.toBeInTheDocument();
			});

			describe('banner campagne de com', () => {
				describe('quand la fonctionnalité de campagne de com est activée', () => {
					it('affiche le composant Header avec l’encart', async () => {
						// Given
						process.env = {
							...process.env,
							NEXT_PUBLIC_CAMPAGNE_COM_EN_COURS_FEATURE: '1',
						};
						mockUseRouter({ pathname: '/' });

						// When
						render(<Header />);

						// Then
						const encartCampagne = screen.getByTestId('mobile-encart-campagne');
						expect(encartCampagne).toBeVisible();
						expect(encartCampagne).toHaveRole('link');
					});
				});
				describe('quand la fonctionnalité de campagne de com est désactivée', () => {
					it('affiche le composant Header sans l’encart', async () => {
						// Given
						process.env = {
							...process.env,
							NEXT_PUBLIC_CAMPAGNE_COM_EN_COURS_FEATURE: '0',
						};
						mockUseRouter({ pathname: '/' });

						// When
						render(<Header />);

						// Then
						const encartCampagne = screen.queryByTestId('mobile-encart-campagne');
						expect(encartCampagne).not.toBeInTheDocument();
					});
				});
			});
		});
		describe('Au clic sur le bouton menu', () => {
			it('ouvre le menu de navigation mobile dans une modale', async () => {
				mockUseRouter({ pathname: '/' });
				const user = userEvent.setup();
				render(<Header />);
				const burgerMenu = screen.getByRole('navigation', { name: 'ouvrir le menu principal' });
				const button = within(burgerMenu).getByRole('button', { name: 'Menu' });
				await user.click(button);

				expect(screen.getByRole('dialog', { name: 'Menu principal' })).toBeVisible();
				const menu = screen.getByRole('navigation', { name: 'menu principal' });
				expect(menu).toBeVisible();
			});

			it('positionne le menu dans le bon sous menu de niveau 1', async () => {
				const user = userEvent.setup();
				mockUseRouter({ pathname: '/decouvrir-les-metiers' });
				render(<Header />);
				const button = screen.getByRole('button', { name: 'Menu' });
				await user.click(button);
				const menu = screen.getByRole('navigation', { name: 'menu principal' });
				expect(menu).toBeVisible();

				const modaleNavigation = screen.getByRole('dialog', { name: 'Menu principal' });
				expect(within(modaleNavigation).getByText('Découvrir les métiers')).toBeVisible();
			});

			it('positionne le menu dans le bon sous menu de niveau 2', async () => {
				const user = userEvent.setup();
				mockUseRouter({ pathname: '/je-deviens-mentor' });
				render(<Header />);
				const button = screen.getByRole('button', { name: 'Menu' });
				await user.click(button);
				const menu = screen.getByRole('navigation', { name: 'menu principal' });
				expect(menu).toBeVisible();

				const modaleNavigation = screen.getByRole('dialog', { name: 'Menu principal' });
				expect(within(modaleNavigation).getByText('Je deviens mentor')).toBeVisible();
			});

			it('positionne le menu dans le bon sous menu de niveau 2 et permet de retourner en arrière', async () => {
				const user = userEvent.setup();
				mockUseRouter({ pathname: '/je-deviens-mentor' });
				render(<Header />);
				const burger = screen.getByRole('button', { name: 'Menu' });
				await user.click(burger);
				const menu = screen.getByRole('navigation', { name: 'menu principal' });
				expect(menu).toBeVisible();

				const modaleNavigation = screen.getByRole('dialog');
				expect(within(modaleNavigation).getByText('Je deviens mentor')).toBeVisible();
				const retourEnArrière = within(modaleNavigation).getByRole('button', { name: 'Recruter et agir pour les jeunes' });
				await user.click(retourEnArrière);
				expect(within(modaleNavigation).getByText('Je suis employeur')).toBeVisible();
			});
		});
		describe('Au clic sur une catégorie', () => {
			it('ferme les autres catégories', async () => {
				const user = userEvent.setup();
				mockUseRouter({ pathname: '/' });
				render(<Header />);
				const burgerMenu = screen.getByRole('navigation', { name: 'ouvrir le menu principal' });
				const button = within(burgerMenu).getByRole('button', { name: 'Menu' });
				await user.click(button);
				const navigationMobile = screen.getByTestId('navigation-mobile');

				const categorie1 = within(navigationMobile).getByRole('button', { name: 'Formations et orientation' });
				await user.click(categorie1);
				const categorie2 = within(navigationMobile).getByRole('button', { name: 'Engagement' });
				expect(categorie1).toHaveAttribute('aria-expanded', 'true');
				expect(categorie2).not.toHaveAttribute('aria-expanded', 'true');
				await user.click(categorie2);
				expect(categorie1).not.toHaveAttribute('aria-expanded', 'true');
				expect(categorie2).toHaveAttribute('aria-expanded', 'true');
			});
		});
		describe('Au clic sur un item du menu', () => {
			it('ferme le menu de navigation', async () => {
				const user = userEvent.setup();
				mockUseRouter({ pathname: '/' });
				render(
					<Header />,
				);
				const button = screen.getByRole('button', { name: 'Menu' });
				await user.click(button);
				const menu = screen.getByRole('navigation', { name: 'menu principal' });
				const navigationMobile = screen.getByTestId('navigation-mobile');

				const item = within(navigationMobile).getByRole('link');
				await user.click(item);

				expect(screen.queryByRole('dialog', { name: 'Menu principal' })).not.toBeInTheDocument();
				expect(menu).not.toBeInTheDocument();
			});
		});

		describe('Au clic sur le menu employeur', () => {
			it('affiche les menus en profondeur tout en laissant visible le bouton du menu employeur', async () => {
				// Given
				mockUseRouter({ pathname: '/' });
				render(
					<Header />,
				);

				const buttonNavEmployeurLabel = 'Je suis employeur';

				// When
				const burgerMenu = screen.getByRole('button', { name: 'Menu' });
				await userEvent.click(burgerMenu);

				const navigationMobile = screen.getByTestId('navigation-mobile');
				const sectionEmployeur = within(navigationMobile).getByRole('button', { name: buttonNavEmployeurLabel });
				await userEvent.click(sectionEmployeur);
				const sousItemSectionEmployeurAyantEncoreUnNiveauPlusProfond = within(navigationMobile).getByRole('button', { name: 'Recruter et agir pour les jeunes' });
				await userEvent.click(sousItemSectionEmployeurAyantEncoreUnNiveauPlusProfond);

				// Then
				expect(within(navigationMobile).getByRole('link', { name: 'Je recrute' })).toBeVisible();
				expect(within(navigationMobile).getByRole('button', { name: buttonNavEmployeurLabel })).toBeVisible();
			});
		});
		describe('navigation au clavier', () => {
			it('l’utilisateur peut naviguer en profondeur dans le dernier item du menu', async () => {
				// Given
				mockUseRouter({ pathname: '/' });
				render(
					<Header />,
				);
				const burgerMenu = screen.getByRole('button', { name: 'Menu' });
				await userEvent.click(burgerMenu);

				const navigationMobile = screen.getByTestId('navigation-mobile');
				const dernierItemDuMenu = within(navigationMobile).getByRole('button', { name: 'Je suis employeur' });
				await userEvent.click(dernierItemDuMenu);

				// When
				await userEvent.tab();

				// Then
				const premierElementEnfantDuDernierItem = within(navigationMobile).getByRole('link', { name: 'Rejoindre la mobilisation' });
				expect(premierElementEnfantDuDernierItem).toHaveFocus();
			});
		});
	});
});
