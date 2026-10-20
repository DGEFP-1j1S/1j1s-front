import '~/test-utils';

import { render, screen } from '@testing-library/react';

import { mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';
import JeRecrutePage from '~/pages/je-recrute/index.page';

describe('<JeRecrutePage />', () => {
	it("doit rendre du HTML respectant la spécification", () => {
		mockSmallScreen();

		const { container } = render(<DependenciesProvider analyticsService={aManualAnalyticsService()}>
			<JeRecrutePage />
		</DependenciesProvider> );

		expect(container.outerHTML).toHTMLValidate();
	});

	it("doit être accessible", async () => {
		mockSmallScreen();

		const { container } = render(
			<DependenciesProvider
				analyticsService={aManualAnalyticsService()}>
				<JeRecrutePage />
			</DependenciesProvider>,
		);

		await expect(container).toBeAccessible();
	});

	it("affiche le titre principal de la page", () => {
		// GIVEN
		renderPage();

		// THEN
		expect(screen.getByRole("heading", { level: 1, name: "Vous cherchez à recruter ?" })).toBeVisible();
	});

	it("affiche les liens vers les dépôt d’offres d’emploi", () => {
		// GIVEN
		renderPage();

		// THEN
		const lienOffreEmploi = screen.getByRole("link", { name: "Déposer une offre d’emploi" });
		const lienOffreAlternance = screen.getByRole("link", { name: "Déposer une offre d’alternance - nouvelle fenêtre" });
		const lienOffreStage = screen.getByRole("link", { name: "Déposer une offre de stage" });
		
		expect(lienOffreEmploi).toHaveAttribute("href", "/emplois/deposer-offre");
		expect(lienOffreAlternance).toHaveAttribute("href", expect.stringContaining("1jeune1solution-recruteurs"));
		expect(lienOffreAlternance).toHaveAttribute("target", "_blank");
		expect(lienOffreStage).toHaveAttribute("href", "/stages/deposer-offre");
	});	

	it("affiche les liens vers pour découvir ou rejoindre la mobilisation", () => {
		// GIVEN
		renderPage();

		// THEN
		const titreSection = screen.getByRole("heading", { level: 2, name: "Découvrez et engagez-vous" });
		const titreMesuresEmployeurs = screen.getByRole("heading", { level: 3, name: "Découvrez les mesures du plan 1jeune1solution pour vous aider à recruter plus facilement" });
		const lienMesuresEmployeurs = screen.getByRole("link", { name: "Découvrir les mesures employeurs" });
		const titreApprentissage = screen.getByRole("heading", { level: 3, name: "Découvrez l’apprentissage, le bon choix pour votre entreprise" });
		const lienApprentissage = screen.getByRole("link", { name: "Découvrir l’apprentissage - nouvelle fenêtre" });
		const titreEntreprisesEngagees = screen.getByRole("heading", { level: 3, name: "Les entreprises s’engagent, une mobilisation des entreprises pour l’emploi des jeunes" });
		const lienMobilisation = screen.getByRole("link", { name: "Rejoindre la mobilisation" });

		expect(titreSection).toBeVisible();
		expect(titreMesuresEmployeurs).toBeVisible();
		expect(lienMesuresEmployeurs).toHaveAttribute("href", "/mesures-employeurs");
		expect(titreApprentissage).toBeVisible();
		expect(lienApprentissage).toHaveAttribute("href", expect.stringContaining("1jeune1solution-recruteurs"));
		expect(lienApprentissage).toHaveAttribute("target", "_blank");
		expect(titreEntreprisesEngagees).toBeVisible();
		expect(lienMobilisation).toHaveAttribute("href", "/les-entreprises-s-engagent");
	});
});

function renderPage() {
	render(
		<DependenciesProvider analyticsService={aManualAnalyticsService()}>
			<JeRecrutePage />
		</DependenciesProvider>,
	);
}
