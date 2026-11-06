import "~/test-utils";

import { render } from "@testing-library/react";

import { DependenciesProvider } from "~/client/context/dependenciesContainer.context";
import { aManualAnalyticsService } from "~/client/services/analytics/analytics.service.fixture";
import PagePhotosAnnonceLogement, { PagePhotosAnnonceLogementProps } from "~/pages/logements/annonces/[id]/photos.page";

function desPhotos(): PagePhotosAnnonceLogementProps {
	return {
		annonce: {
			imageList: [
				{ alt: "photo du salon", src: "/salon.webp" },
				{ alt: "", src: "/cuisine.webp" },
				{ src: "/chambre.webp" },
			],
			slug: "super-t3-paris",
			source: "immojeune",
			titre: "Super T3 dans le centre de Paris",
		},
		isFeatureActive: true,
	};
}

function afficherLaPage(props: PagePhotosAnnonceLogementProps = desPhotos()) {
	return render(
		<DependenciesProvider analyticsService={aManualAnalyticsService()}>
			<PagePhotosAnnonceLogement {...props} />
		</DependenciesProvider>,
	);
}

describe("Page Photos annonce logement", () => {
	describe("<PagePhotosAnnonceLogement />", () => {
		it("doit rendre du HTML respectant la spécification", () => {
			// GIVEN
			const { container } = afficherLaPage();

			// THEN
			expect(container.outerHTML).toHTMLValidate();
		});

		it("doit être accessible", async () => {
			// GIVEN
			const { container } = afficherLaPage();

			// THEN
			await expect(container).toBeAccessible();
		});
	});
});
