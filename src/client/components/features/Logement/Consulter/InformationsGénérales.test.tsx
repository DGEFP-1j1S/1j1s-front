import { render, screen } from '@testing-library/react';
import React from 'react';

import { InformationsGénérales } from '~/client/components/features/Logement/Consulter/InformationsGénérales';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aDateService } from '~/client/services/date/date.service.fixture';
import { anAnnonceDeLogement } from '~/server/logements/domain/annonceDeLogement.fixture';

describe('<InformationsGénérales />', () => {
	describe('Prix', () => {
		it('affiche le prix', async () => {
			const annonce = anAnnonceDeLogement();
			annonce.prix = 500;
			render(<DependenciesProvider dateService={aDateService()}>
				<InformationsGénérales annonce={annonce} />
			</DependenciesProvider>);

			const prixRow = screen.getByRole('row', { name: /Prix/i });
			expect(prixRow).toHaveTextContent(/500 €CC\/mois/i);
			const abbreviation = screen.getByText(/CC/i);
			expect(abbreviation).toHaveAttribute('title', 'Charges Comprises');
		});
		it('affiche la bonne devise dans le prix', async () => {
			const annonce = anAnnonceDeLogement();
			annonce.devise = '$';
			render(<DependenciesProvider dateService={aDateService()}>
				<InformationsGénérales annonce={annonce} />
			</DependenciesProvider>);

			const prixRow = screen.getByRole('row', { name: /Prix/i });
			expect(prixRow).toHaveTextContent(/\$/i);
		});
		it('affiche les charges', async () => {
			const annonce = anAnnonceDeLogement();
			annonce.charge = 500;
			render(<DependenciesProvider dateService={aDateService()}>
				<InformationsGénérales annonce={annonce} />
			</DependenciesProvider>);

			const chargesRow = screen.getByRole('row', { name: /Charges/i });
			expect(chargesRow).toHaveTextContent(/500 €/i);
		});
		it('masque la ligne quand pas de charges', async () => {
			const annonce = anAnnonceDeLogement();
			annonce.charge = undefined;
			render(<DependenciesProvider dateService={aDateService()}>
				<InformationsGénérales annonce={annonce} />
			</DependenciesProvider>);

			const chargesRow = screen.queryByRole('row', { name: /Charges/i });
			expect(chargesRow).not.toBeInTheDocument();
		});
		it('affiche la bonne devise dans les charges', async () => {
			const annonce = anAnnonceDeLogement();
			annonce.devise = '$';
			render(<DependenciesProvider dateService={aDateService()}>
				<InformationsGénérales annonce={annonce} />
			</DependenciesProvider>);

			const chargesRow = screen.getByRole('row', { name: /Charges/i });
			expect(chargesRow).toHaveTextContent(/\$/i);
		});
		it('affiche la caution', async () => {
			const annonce = anAnnonceDeLogement();
			annonce.garantie = 500;
			render(<DependenciesProvider dateService={aDateService()}>
				<InformationsGénérales annonce={annonce} />
			</DependenciesProvider>);

			const cautionRow = screen.getByRole('row', { name: /Caution/i });
			expect(cautionRow).toHaveTextContent(/500 €/i);
		});
		it('masque la ligne quand pas de caution', async () => {
			const annonce = anAnnonceDeLogement();
			annonce.garantie = undefined;
			render(<DependenciesProvider dateService={aDateService()}>
				<InformationsGénérales annonce={annonce} />
			</DependenciesProvider>);

			const cautionRow = screen.queryByRole('row', { name: /Caution/i });
			expect(cautionRow).not.toBeInTheDocument();
		});
		it('affiche la bonne devise dans la caution', async () => {
			const annonce = anAnnonceDeLogement();
			annonce.devise = '$';
			render(<DependenciesProvider dateService={aDateService()}>
				<InformationsGénérales annonce={annonce} />
			</DependenciesProvider>);

			const cautionRow = screen.getByRole('row', { name: /Caution/i });
			expect(cautionRow).toHaveTextContent(/\$/i);
		});
	});
	describe('Informations du logement', () => {
		describe('concernant la surface', () => {
			describe('quand la surfaceMax est renseignée', () => {
				it('affiche la fourchette de surface', () => {
					const annonce = anAnnonceDeLogement();
					annonce.surface = 50;
					annonce.surfaceMax = 100;
					render(<DependenciesProvider dateService={aDateService()}>
						<InformationsGénérales annonce={annonce} />
					</DependenciesProvider>);

					const surfaceRow = screen.getByRole('row', { name: /Surface/i });
					expect(surfaceRow).toHaveTextContent(/50 à 100 m2/i);
				});
			});
			describe('quand la surfaceMax vaut zéro', () => {
				it('affiche la surface', async () => {
					const annonce = anAnnonceDeLogement();
					annonce.surface = 50;
					annonce.surfaceMax = 0;
					render(<DependenciesProvider dateService={aDateService()}>
						<InformationsGénérales annonce={annonce} />
					</DependenciesProvider>);

					const surfaceRow = screen.getByRole('row', { name: /Surface/i });
					expect(surfaceRow).toHaveTextContent(/50m2/i);
				});
			});
			describe('quand la surfaceMax vaut undefined', () => {
				it('affiche la surface', async () => {
					const annonce = anAnnonceDeLogement();
					annonce.surface = 50;
					annonce.surfaceMax = undefined;
					render(<DependenciesProvider dateService={aDateService()}>
						<InformationsGénérales annonce={annonce} />
					</DependenciesProvider>);

					const surfaceRow = screen.getByRole('row', { name: /Surface/i });
					expect(surfaceRow).toHaveTextContent(/50m2/i);
				});
			});
		});
		describe('concernant le nombre de pièces', () => {
			it('affiche le nombre de pièces lorsque le nombre de pièces est supérieur à 0', async () => {
				const annonce = anAnnonceDeLogement();
				annonce.nombreDePièces = 2;
				render(<DependenciesProvider dateService={aDateService()}>
					<InformationsGénérales annonce={annonce} />
				</DependenciesProvider>);

				const piècesRow = screen.getByRole('row', { name: /Nombre de pièces/i });
				expect(piècesRow).toHaveTextContent(/2/i);
			});
			it('affiche le message attendu lorsque le nombre de pièces est 0', async () => {
				const annonce = anAnnonceDeLogement();
				annonce.nombreDePièces = 0;
				render(<DependenciesProvider dateService={aDateService()}>
					<InformationsGénérales annonce={annonce} />
				</DependenciesProvider>);

				const piècesRow = screen.getByRole('row', { name: /Nombre de pièces/i });
				expect(piècesRow).toHaveTextContent(/non renseigné/i);

			});
		});

		it("affiche l'étage", async () => {
			const annonce = anAnnonceDeLogement();
			annonce.étage = 2;
			render(<DependenciesProvider dateService={aDateService()}>
				<InformationsGénérales annonce={annonce} />
			</DependenciesProvider>);

			const étageRow = screen.getByRole('row', { name: /Étage/i });
			expect(étageRow).toHaveTextContent(/2ème/i);
		});
		it('affiche "Rez-de-chaussée" quand l\'étage est 0', async () => {
			const annonce = anAnnonceDeLogement();
			annonce.étage = 0;
			render(<DependenciesProvider dateService={aDateService()}>
				<InformationsGénérales annonce={annonce} />
			</DependenciesProvider>);

			const étageRow = screen.getByRole('row', { name: /Étage/i });
			expect(étageRow).toHaveTextContent(/Rez-de-chaussée/i);
		});
		it('affiche "1er" quand l\'étage est 1', async () => {
			const annonce = anAnnonceDeLogement();
			annonce.étage = 1;
			render(<DependenciesProvider dateService={aDateService()}>
				<InformationsGénérales annonce={annonce} />
			</DependenciesProvider>);

			const étageRow = screen.getByRole('row', { name: /Étage/i });
			expect(étageRow).toHaveTextContent(/1er/i);
		});
		it("masque la ligne quand pas d'étage", async () => {
			const annonce = anAnnonceDeLogement();
			annonce.étage = undefined;
			render(<DependenciesProvider dateService={aDateService()}>
				<InformationsGénérales annonce={annonce} />
			</DependenciesProvider>);

			const étageRow = screen.queryByRole('row', { name: /Étage/i });
			expect(étageRow).not.toBeInTheDocument();
		});
		it('affiche le type de bien', async () => {
			const annonce = anAnnonceDeLogement();
			annonce.typeBien = 'Appartement';
			render(<DependenciesProvider dateService={aDateService()}>
				<InformationsGénérales annonce={annonce} />
			</DependenciesProvider>);

			const typeBienRow = screen.getByRole('row', { name: /Type de bien/i });
			expect(typeBienRow).toHaveTextContent(/Appartement/i);
		});
		it('affiche "Non" si le logement n\'est pas meublé', async () => {
			const annonce = anAnnonceDeLogement();
			annonce.meublé = false;
			render(<DependenciesProvider dateService={aDateService()}>
				<InformationsGénérales annonce={annonce} />
			</DependenciesProvider>);

			const meubléRow = screen.getByRole('row', { name: /Meublé/i });
			expect(meubléRow).toHaveTextContent(/Non/i);
		});
		it('affiche "Oui" si le logement est meublé', async () => {
			const annonce = anAnnonceDeLogement();
			annonce.meublé = true;
			render(<DependenciesProvider dateService={aDateService()}>
				<InformationsGénérales annonce={annonce} />
			</DependenciesProvider>);

			const meubléRow = screen.getByRole('row', { name: /Meublé/i });
			expect(meubléRow).toHaveTextContent(/Oui/i);
		});
	});
	describe('Localisation', () => {
		it('affiche la localisation formattée', async () => {
			const annonce = anAnnonceDeLogement();
			annonce.localisation = {
				adresse: "15 rue de l'impasse",
				codePostal: '75001',
				ville: 'Paris',
			};
			render(<DependenciesProvider dateService={aDateService()}>
				<InformationsGénérales annonce={annonce} />
			</DependenciesProvider>);

			const localisationRow = screen.getByRole('row', { name: /Localisation/i });
			expect(localisationRow).toHaveTextContent(/15 rue de l'impasse, Paris \(75001\)/i);
		});
		it('masque la localisation quand aucune information affichable', async () => {
			const annonce = anAnnonceDeLogement();
			annonce.localisation = {
				adresse: undefined,
				codePostal: undefined,
				ville: undefined,
			};
			render(<DependenciesProvider dateService={aDateService()}>
				<InformationsGénérales annonce={annonce} />
			</DependenciesProvider>);

			const localisationRow = screen.queryByRole('row', { name: /Localisation/i });
			expect(localisationRow).not.toBeInTheDocument();
		});
	});
	describe('Disponibilité', () => {
		it('affiche la date de disponibilité', async () => {
			const dateService = aDateService();
			const annonce = anAnnonceDeLogement({
				dateDeDisponibilité: new Date(2022, 1, 1),
			});
			vi.spyOn(dateService, 'formatToHumanReadableDate').mockReturnValue('1 janvier 2022');
			render(
				<DependenciesProvider dateService={dateService}>
					<InformationsGénérales annonce={annonce} />
				</DependenciesProvider>,
			);

			const disponibilitéRow = screen.getByRole('row', { name: /Disponible/i });
			expect(disponibilitéRow).toHaveTextContent(/le 1 janvier 2022/i);
		});
	});
});
