import "~/test-utils";

import { render, screen } from "@testing-library/react";

import MyJobGlassesPage, { getServerSideProps } from "~/pages/myjobglasses/index.page";

describe("Page My Job Glasses", () => {
	describe("<MyJobGlassesPage />", () => {
		it("doit rendre du HTML respectant la spécification", () => {
			// WHEN
			const { container } = render(<MyJobGlassesPage />);

			// THEN
			expect(container.outerHTML).toHTMLValidate();
		});

		it("doit être accessible", async () => {
			// WHEN
			const { container } = render(<MyJobGlassesPage />);

			// THEN
			await expect(container).toBeAccessible();
		});

		it("affiche le titre Échanger avec des professionnels", () => {
			// WHEN
			render(<MyJobGlassesPage />);

			// THEN
			expect(screen.getByRole("heading", { level: 1, name: "Échanger avec des professionnels" })).toBeVisible();
		});

		it("affiche un lien vers la recherche de professionnels My Job Glasses", () => {
			// WHEN
			render(<MyJobGlassesPage />);

			// THEN
			const lien = screen.getByRole("link", { name: /Trouver un professionnel/ });
			expect(lien).toHaveAttribute("href", "https://www.myjobglasses.com/search");
		});
	});

	describe("lorsque la feature est désactivée", () => {
		it("retourne une page 404", () => {
			// GIVEN
			process.env.NEXT_PUBLIC_MY_JOB_GLASSES_FEATURE = "0";

			// WHEN
			const result = getServerSideProps();

			// THEN
			expect(result).toEqual({ notFound: true });
		});
	});
});
