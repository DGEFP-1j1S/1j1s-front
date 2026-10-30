import { render, screen, within } from '@testing-library/react';

import { ConsulterAnnonce } from '~/client/components/features/Logement/Consulter/ConsulterAnnonce';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aDateService } from '~/client/services/date/date.service.fixture';
import { aStorageService } from '~/client/services/storage/storage.service.fixture';
import { anAnnonceDeLogement } from '~/server/logements/domain/annonceDeLogement.fixture';

describe('<ConsulterAnnonce />', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		mockSmallScreen();
		const routerReload = vi.fn();
		mockUseRouter({ reload: routerReload });
	});

	it("affiche le titre de l'annonce", () => {
		const annonceDeLogement = anAnnonceDeLogement({
			titre: 'Super T3 dans le centre de Paris',
		});

		render(
			<DependenciesProvider dateService={aDateService()} sessionStorageService={aStorageService()}>
				<ConsulterAnnonce annonceDeLogement={annonceDeLogement} />
			</DependenciesProvider>,
		);

		const titre = screen.getByRole('heading', {
			level: 1,
		});
		expect(titre).toBeVisible();
		expect(titre).toHaveTextContent('Super T3 dans le centre de Paris');
	});

	it('affiche le type de logement', () => {
		const annonceDeLogement = anAnnonceDeLogement({
			type: 'Location',
			typeBien: 'Appartement',
		});

		render(
			<DependenciesProvider dateService={aDateService()} sessionStorageService={aStorageService()}>
				<ConsulterAnnonce annonceDeLogement={annonceDeLogement} />
			</DependenciesProvider>,
		);

		const type = screen.getByText(/Location - Appartement/i);
		expect(type).toBeVisible();
	});

	it('affiche la date de mise à jour au bon format', () => {
		const dateService = aDateService({
			formatToHumanReadableDate: () => '1 février 2020',
		});

		render(
			<DependenciesProvider dateService={dateService} sessionStorageService={aStorageService()}>
				<ConsulterAnnonce annonceDeLogement={anAnnonceDeLogement()} />
			</DependenciesProvider>,
		);

		const date = screen.getByText(/Annonce mise à jour le/i);
		expect(date).toBeVisible();
		expect(date).toHaveTextContent(/Annonce mise à jour le 1 février 2020/i);
	});

	describe('carousel', () => {
		let annonceDeLogement = anAnnonceDeLogement();
		beforeEach(() => {
			annonceDeLogement = anAnnonceDeLogement();
		});

		it('affiche correctement le carousel', () => {
			annonceDeLogement.imageList = [
				{ alt: '', src: '/une-première-image.webp' },
				{ alt: '', src: '/une-deuxième-image.webp' },
			];
			render(
				<DependenciesProvider dateService={aDateService()} sessionStorageService={aStorageService()}>
					<ConsulterAnnonce annonceDeLogement={annonceDeLogement} />
				</DependenciesProvider>,
			);

			const carousel = screen.getByText((content, element) => element?.getAttribute('aria-roledescription') === 'carousel');
			expect(carousel).toBeVisible();
			expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
			expect(carousel).not.toHaveAttribute('aria-hidden');
		});

		describe('quand il n‘y a pas d‘image a afficher', () => {
			it('n‘affiche pas le carousel', () => {
				annonceDeLogement.imageList = [];

				render(
					<DependenciesProvider dateService={aDateService()} sessionStorageService={aStorageService()}>
						<ConsulterAnnonce annonceDeLogement={annonceDeLogement} />
					</DependenciesProvider>,
				);

				const listDeSlides = screen.queryByRole('list', { name: 'liste des photos' });
				expect(listDeSlides).not.toBeInTheDocument();
			});
		});

		describe('quand il y a une seule image a afficher', () => {
			it('n‘affiche pas le carousel, juste une image', () => {
				annonceDeLogement.imageList = [{ alt: 'une seule image', src: '/une-seule-image.webp' }];

				render(
					<DependenciesProvider dateService={aDateService()} sessionStorageService={aStorageService()}>
						<ConsulterAnnonce annonceDeLogement={annonceDeLogement} />
					</DependenciesProvider>,
				);

				const listDeSlides = screen.queryByRole('list', { name: 'liste des photos' });
				expect(listDeSlides).not.toBeInTheDocument();
				const image = screen.getByRole('img', { name: 'une seule image' });
				expect(image).toBeVisible();
				expect(image).toHaveAttribute('src', expect.stringMatching(/une-seule-image\.webp/));
			});
		});

		describe('quand il y a plusieurs images a afficher', () => {
			it('affiche le carousel', () => {
				annonceDeLogement.imageList = [
					{ alt: '', src: '/une-première-image.webp' },
					{ alt: '', src: '/une-deuxième-image.webp' },
				];
				render(
					<DependenciesProvider dateService={aDateService()} sessionStorageService={aStorageService()}>
						<ConsulterAnnonce annonceDeLogement={annonceDeLogement} />
					</DependenciesProvider>,
				);

				const listDesSlides = screen.getByText((content, element) => element?.getAttribute('aria-live') === 'polite');
				expect(listDesSlides).toBeVisible();
			});
		});
	});
	it('affiche la description du logement', () => {
		const annonceDeLogement = anAnnonceDeLogement({
			description: "C'est un super logement !",
		});

		render(
			<DependenciesProvider dateService={aDateService()} sessionStorageService={aStorageService()}>
				<ConsulterAnnonce annonceDeLogement={annonceDeLogement} />
			</DependenciesProvider>,
		);

		const description = screen.getByText(/C'est un super logement !/i);
		expect(description).toBeVisible();
	});
	it('affiche les informations générales', () => {
		const annonceDeLogement = anAnnonceDeLogement();

		render(
			<DependenciesProvider dateService={aDateService()} sessionStorageService={aStorageService()}>
				<ConsulterAnnonce annonceDeLogement={annonceDeLogement} />
			</DependenciesProvider>,
		);

		const section = screen.getByRole('region', { name: /Informations Générales/i });
		expect(section).toBeVisible();
	});

	describe('bilan énergétique du logement', () => {
		it('affiche la consommation énergétique du logement', () => {
			const annonceDeLogement = anAnnonceDeLogement();
			annonceDeLogement.bilanEnergetique.consommationEnergetique = 'A';

			render(
				<DependenciesProvider dateService={aDateService()} sessionStorageService={aStorageService()}>
					<ConsulterAnnonce annonceDeLogement={annonceDeLogement} />
				</DependenciesProvider>,
			);
			
			const consommationEnergetique = screen.getByRole('img', { name: /A/i });
			expect(consommationEnergetique).toBeVisible();
		});
		it('affiche le libellé de la consommation énergétique du logement', () => {
			const annonceDeLogement = anAnnonceDeLogement();
			annonceDeLogement.bilanEnergetique.consommationEnergetique = 'A';

			render(<DependenciesProvider sessionStorageService={aStorageService()} dateService={aDateService()}>
				<ConsulterAnnonce annonceDeLogement={annonceDeLogement} />
			</DependenciesProvider>);
			const tag = screen.getByRole('img', { name: /A/i });
			const description = screen.getByText(/Excellente performance énergétique/i);

			expect(tag).toHaveAttribute('aria-describedby', description.id);
		});
		it('affiche la couleur de la consommation énergétique du logement', () => {
			const annonceDeLogement = anAnnonceDeLogement();
			annonceDeLogement.bilanEnergetique.consommationEnergetique = 'A';

			render(<DependenciesProvider sessionStorageService={aStorageService()} dateService={aDateService()}>
				<ConsulterAnnonce annonceDeLogement={annonceDeLogement} />
			</DependenciesProvider>);
			const tag = screen.getByRole('img', { name: /A/i });

			expect(tag).toHaveAttribute('style', '--color: var(--color-a); --text-color: var(--text-color-a);');
		});
		it('affiche l’émission de gaz du logement', () => {
			const annonceDeLogement = anAnnonceDeLogement();
			annonceDeLogement.bilanEnergetique.emissionDeGaz = 'G';

			render(<DependenciesProvider sessionStorageService={aStorageService()} dateService={aDateService()}>
				<ConsulterAnnonce annonceDeLogement={annonceDeLogement} />
			</DependenciesProvider>);
			const emissionDeGaz = screen.getByRole('img', { name: /G/i });

			expect(emissionDeGaz).toBeVisible();
		});
		it('affiche le libellé de l’émission de gaz du logement', () => {
			const annonceDeLogement = anAnnonceDeLogement();
			annonceDeLogement.bilanEnergetique.emissionDeGaz = 'G';

			render(<DependenciesProvider sessionStorageService={aStorageService()} dateService={aDateService()}>
				<ConsulterAnnonce annonceDeLogement={annonceDeLogement} />
			</DependenciesProvider>);
			const tag = screen.getByRole('img', { name: /G/i });

			expect(tag).toHaveAccessibleDescription(/Très importante émission de gaz à effet de serre/i);
		});
		it('affiche la couleur de l’émission de gaz du logement', () => {
			const annonceDeLogement = anAnnonceDeLogement();
			annonceDeLogement.bilanEnergetique.emissionDeGaz = 'G';

			render(<DependenciesProvider sessionStorageService={aStorageService()} dateService={aDateService()}>
				<ConsulterAnnonce annonceDeLogement={annonceDeLogement} />
			</DependenciesProvider>);
			const tag = screen.getByRole('img', { name: /G/i });

			expect(tag).toHaveAttribute('style', '--color: var(--color-g); --text-color: var(--text-color-g);');
		});
		it('affiche le titre pour les émissions de gaz à effet de serre', async () => {
			const annonceDeLogement = anAnnonceDeLogement();
			annonceDeLogement.bilanEnergetique.emissionDeGaz = 'G';

			render(<DependenciesProvider sessionStorageService={aStorageService()} dateService={aDateService()}>
				<ConsulterAnnonce annonceDeLogement={annonceDeLogement} />
			</DependenciesProvider>);

			const titre = screen.getByRole('heading', { level: 2, name: 'Émissions de GES' });
			expect(titre).toBeVisible();
			const abréviation = screen.getByText('GES');
			expect(abréviation).toHaveAttribute('title', 'Gaz à Effet de Serre');
		});
	});

	describe('source', () => {
		describe('quand la source est immojeune', () => {
			it('retourne le logo immojeune', () => {
				const annonceDeLogement = anAnnonceDeLogement({ source: 'immojeune' });
				render(<DependenciesProvider sessionStorageService={aStorageService()} dateService={aDateService()}>
					<ConsulterAnnonce annonceDeLogement={annonceDeLogement} />
				</DependenciesProvider>);
				const diffuseurMobile = screen.getByTestId('source-annonce-mobile');
				const diffuseurDesktop = screen.getByTestId('source-annonce-desktop');
				expect(diffuseurMobile).toBeVisible();
				expect(diffuseurDesktop).toBeVisible();
				expect(diffuseurMobile).toHaveTextContent('Ce bien est diffusé par');
				expect(diffuseurDesktop).toHaveTextContent('Ce bien est diffusé par');

				const logoDiffuseurMobile = within(diffuseurMobile).getByRole('img', { name: 'immojeune' });
				const logoDiffuseurDesktop = within(diffuseurDesktop).getByRole('img', { name: 'immojeune' });
				expect(logoDiffuseurMobile).toBeVisible();
				expect(logoDiffuseurDesktop).toBeVisible();
			});
		});

		describe('quand la source est studapart', () => {
			it('retourne le logo studapart', () => {
				const annonceDeLogement = anAnnonceDeLogement({ source: 'studapart' });
				render(<DependenciesProvider sessionStorageService={aStorageService()} dateService={aDateService()}>
					<ConsulterAnnonce annonceDeLogement={annonceDeLogement} />
				</DependenciesProvider>);
				const diffuseurMobile = screen.getByTestId('source-annonce-mobile');
				const diffuseurDesktop = screen.getByTestId('source-annonce-desktop');
				expect(diffuseurMobile).toBeVisible();
				expect(diffuseurDesktop).toBeVisible();
				expect(diffuseurMobile).toHaveTextContent('Ce bien est diffusé par');
				expect(diffuseurDesktop).toHaveTextContent('Ce bien est diffusé par');

				const logoDiffuseurMobile = within(diffuseurMobile).getByRole('img', { name: 'studapart' });
				const logoDiffuseurDesktop = within(diffuseurDesktop).getByRole('img', { name: 'studapart' });
				expect(logoDiffuseurMobile).toBeVisible();
				expect(logoDiffuseurDesktop).toBeVisible();
			});
		});

		describe('quand la source est inconnu', () => {
			it('retourne rien', () => {
				// @ts-expect-error TS(2322)
				const annonceDeLogement = anAnnonceDeLogement({ source: 'seloger' });
				render(<DependenciesProvider sessionStorageService={aStorageService()} dateService={aDateService()}>
					<ConsulterAnnonce annonceDeLogement={annonceDeLogement} />
				</DependenciesProvider>);
				const diffuseur = screen.queryByText('Ce bien est diffusé par');

				expect(diffuseur).not.toBeInTheDocument();
				expect(diffuseur).toBeNull();
			});
		});
	});

	describe('call to action Voir l‘annonce', () => {
		it('affiche un lien externe Voir l‘annonce', () => {
			const annonceDeLogement = anAnnonceDeLogement({ urlDeCandidature: 'https://example.com' });
			render(<DependenciesProvider sessionStorageService={aStorageService()} dateService={aDateService()}>
				<ConsulterAnnonce annonceDeLogement={annonceDeLogement} />
			</DependenciesProvider>);
			const lienExterneCandidaterMobileEtDesktop = screen.getAllByRole('link', { name: 'Voir l‘annonce - nouvelle fenêtre' });

			expect(lienExterneCandidaterMobileEtDesktop[0]).toBeVisible();
			expect(lienExterneCandidaterMobileEtDesktop[0]).toHaveAttribute('href', 'https://example.com');
		});
	});
	it('affiche les services', () => {
		const annonceDeLogement = anAnnonceDeLogement();

		render(<DependenciesProvider sessionStorageService={aStorageService()} dateService={aDateService()}>
			<ConsulterAnnonce annonceDeLogement={annonceDeLogement} />
		</DependenciesProvider>);
		const section = screen.getByRole('region', { name: /Équipements et services/i });

		expect(section).toBeVisible();
	});
});
