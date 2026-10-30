import {
	render,
	screen,
} from '@testing-library/react';

import { AnnonceDeLogement } from '~/client/components/features/Logement/Annonce';
import { AnnonceDeLogementIndexee } from '~/server/logements/domain/annonceDeLogementIndexee';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aDateService } from '~/client/services/date/date.service.fixture';


const anAnnonceDeLogement = (override?: Partial<AnnonceDeLogementIndexee>): AnnonceDeLogementIndexee => {
	return {
		dateDeDisponibilite: '2023-01-01',
		dateDeMiseAJour: '2022-12-04',
		devise: '€',
		imagesUrl: ['/image-0.jpg', '/image-1.jpg', '/image-2.jpg'],
		localisationAAfficher: 'Paris',
		prix: 1200,
		prixHT: 1000,
		slug: 'un-slug-appart-a-louer',
		surfaceAAfficher: 'de 70 à 71m2',
		titre: 'Appartement à louer',
		type: 'appartement',
		typeBien: 'T1',
		url: 'https://www.immo.com',
		...override,
	};
};


describe('Annonce Component', () => {
	describe('quand il n‘y a pas d‘image', () => {
		it('contient une image par défaut', () => {
			render(
				<DependenciesProvider dateService={aDateService()}>
					<AnnonceDeLogement
						annonce={anAnnonceDeLogement({ imagesUrl: [] })} />
				</DependenciesProvider>,
			);
			const image: HTMLImageElement = screen.getByRole('presentation');
			expect(image.src).toContain('images/image-par-defaut-carte.webp');
		});
	});

	describe("quand il n'y a qu‘une image", () => {
		it('contient l‘image', () => {
			render(
				<DependenciesProvider dateService={aDateService()}>
					<AnnonceDeLogement
						annonce={anAnnonceDeLogement({ imagesUrl: ['/image-0.jpg'] })} />
				</DependenciesProvider>,
			);
			const image: HTMLImageElement = screen.getByRole('presentation');
			expect(image.src).toContain('image-0.jpg');
		});
	});

	describe('quand il y a plusieurs images', () => {
		it('contient un carousel d‘images', () => {
			render(
				<DependenciesProvider dateService={aDateService()}>
					<AnnonceDeLogement
						annonce={anAnnonceDeLogement()} />
				</DependenciesProvider>,
			);
			const listDesSlides = screen.getByText((content, element) => element?.getAttribute('aria-live') === 'polite');
			expect(listDesSlides).toBeInTheDocument();
		});
	});


	describe('type de logement', () => {
		describe('quand le type de logement est habitation intergénérationnelle', () => {
			it('contient le type de logement intérgénérationnel', () => {
				render(
					<DependenciesProvider dateService={aDateService()}>
						<AnnonceDeLogement
							annonce={anAnnonceDeLogement({ type: 'habitation intergénérationnelle' })} />
					</DependenciesProvider>,
				);
				const type = screen.getByText(/intergénérationnel/i);
				expect(type).toBeVisible();
			});
		});

		describe('quand le type de logement est autre', () => {
			it('contient le type de logement', () => {
				render(
					<DependenciesProvider dateService={aDateService()}>
						<AnnonceDeLogement
							annonce={anAnnonceDeLogement()} />
					</DependenciesProvider>,
				);
				const appartement = 'appartement';
				const type = screen.getByText(appartement);
				expect(type).toBeInTheDocument();
			});
		});
	});

	it('contient la date de mise à jour', () => {
		const dateService = aDateService();
		const annoncesLogement = anAnnonceDeLogement({
			dateDeMiseAJour: '12/4/2022',
		});
		vi.spyOn(dateService, 'formatToHumanReadableDate').mockReturnValue('12 avril 2022');

		render(
			<DependenciesProvider dateService={dateService}>
				<AnnonceDeLogement
					annonce={annoncesLogement} />
			</DependenciesProvider>,
		);
		const dateDePublication = 'postée le 12 avril 2022';
		const date = screen.getByText(dateDePublication);
		expect(date).toBeInTheDocument();
	});

	it('contient le titre de l‘annonce', () => {
		render(
			<DependenciesProvider dateService={aDateService()}>
				<AnnonceDeLogement
					annonce={anAnnonceDeLogement()} />
			</DependenciesProvider>,
		);
		const titre = screen.getByRole('heading', { level: 3 });
		expect(titre).toBeInTheDocument();
	});

	it('contient la surface et le prix', () => {
		render(
			<DependenciesProvider dateService={aDateService()}>
				<AnnonceDeLogement
					annonce={anAnnonceDeLogement()} />
			</DependenciesProvider>,
		);
		const intervalleSurface = 'de 70 à 71m2';
		const surface = screen.getByText(intervalleSurface);
		expect(surface).toBeInTheDocument();

		const loyer = '1200 €';
		const prix = screen.getByText(loyer);
		expect(prix).toBeInTheDocument();
	});

	it('contient la localisation', () => {
		render(
			<DependenciesProvider dateService={aDateService()}>
				<AnnonceDeLogement
					annonce={anAnnonceDeLogement()} />
			</DependenciesProvider>,
		);
		const ville = 'Paris';
		const localisation = screen.getByText(ville);
		expect(localisation).toBeInTheDocument();
	});

	it('contient le lien externe de l‘annonce', () => {
		const ariaLabelledbyValue = anAnnonceDeLogement().slug;

		render(
			<DependenciesProvider dateService={aDateService()}>
				<AnnonceDeLogement
					annonce={anAnnonceDeLogement()} />
			</DependenciesProvider>,
		);
		const url = screen.getByRole('link');
		expect(url).toBeInTheDocument();
		expect(url).toHaveAttribute('href', '/logements/annonces/un-slug-appart-a-louer');
		expect(url).toHaveAttribute('aria-labelledby', `${ariaLabelledbyValue}`);
	});
});
