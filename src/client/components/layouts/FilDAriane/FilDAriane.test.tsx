import { render, screen } from "@testing-library/react";
import { readdirSync, statSync } from "fs";
import { join, relative } from "path";
import React from "react";

import { FilDAriane } from "~/client/components/layouts/FilDAriane/FilDAriane";
import { filDArianeConfig } from "~/client/components/layouts/FilDAriane/filDAriane.config";
import { mockUseRouter } from "~/client/components/useRouter.mock";

const PAGES_DIRECTORY = join(__dirname, "../../../../pages");
const PAGES_SANS_FIL_D_ARIANE = ["/", "/404", "/_app", "/_document", "/_error", "/maintenance-france-travail"];

function listerPages(directory: string): string[] {
	return readdirSync(directory).flatMap((entry) => {
		const path = join(directory, entry);
		if (statSync(path).isDirectory()) return entry === "api" ? [] : listerPages(path);
		return entry.endsWith(".page.tsx") ? [path] : [];
	});
}

function versPathname(file: string) {
	const pathname = "/" + relative(PAGES_DIRECTORY, file).replace(/\.page\.tsx$/, "").replace(/(^|\/)index$/, "");
	return pathname.length > 1 ? pathname.replace(/\/$/, "") : "/";
}

describe("<FilDAriane />", () => {
	describe("lorsque la page est une page statique", () => {
		it("affiche l'accueil puis le libellé de la page courante", () => {
			// GIVEN
			mockUseRouter({ pathname: "/emplois" });

			// WHEN
			render(<FilDAriane />);

			// THEN
			expect(screen.getByRole("link", { name: "Accueil" })).toBeInTheDocument();
			expect(screen.getByText("Emplois")).toHaveAttribute("aria-current", "page");
		});

		it("affiche les pages parentes sous forme de liens", () => {
			// GIVEN
			mockUseRouter({ pathname: "/stages/deposer-offre/localisation" });

			// WHEN
			render(<FilDAriane />);

			// THEN
			expect(screen.getByRole("link", { name: "Je recrute" })).toHaveAttribute("href", "/je-recrute");
			expect(screen.getByText("Localisation du stage")).toHaveAttribute("aria-current", "page");
		});
	});

	describe("lorsque la page est une étape du formulaire de dépôt d'offre de stage", () => {
		it.each([
			["/stages/deposer-offre", [], "Votre entreprise"],
			["/stages/deposer-offre/votre-offre-de-stage", ["Votre entreprise"], "Votre offre de stage"],
			["/stages/deposer-offre/localisation", ["Votre entreprise", "Votre offre de stage"], "Localisation du stage"],
		])("affiche les étapes précédentes en liens pour %s", (pathname, etapesPrecedentes, etapeCourante) => {
			// GIVEN
			mockUseRouter({ pathname });

			// WHEN
			render(<FilDAriane />);

			// THEN
			const liens = screen.getAllByRole("link").map((lien) => lien.textContent);
			expect(liens).toEqual(["Accueil", "Je recrute", ...etapesPrecedentes]);
			expect(screen.getByText(etapeCourante)).toHaveAttribute("aria-current", "page");
		});
	});

	describe("lorsque la page est une page de détail", () => {
		it("affiche le titre issu des props de la page", () => {
			// GIVEN
			mockUseRouter({ pathname: "/emplois/[id]" });
			const pageProps = { offreEmploi: { intitulé: "Développeur React H/F" } };

			// WHEN
			render(<FilDAriane pageProps={pageProps} />);

			// THEN
			expect(screen.getByRole("link", { name: "Emplois" })).toHaveAttribute("href", "/emplois");
			expect(screen.getByText("Développeur React H/F")).toHaveAttribute("aria-current", "page");
		});

		it("n'affiche rien lorsque le titre est absent des props", () => {
			// GIVEN
			mockUseRouter({ pathname: "/emplois/[id]" });

			// WHEN
			render(<FilDAriane pageProps={{}} />);

			// THEN
			expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
		});
	});

	describe("lorsque la page n'a pas de fil d'Ariane", () => {
		it.each(["/", "/route-inconnue"])("n'affiche rien pour %s", (pathname) => {
			// GIVEN
			mockUseRouter({ pathname });

			// WHEN
			render(<FilDAriane />);

			// THEN
			expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
		});
	});

	it("définit un fil d'Ariane pour toutes les pages", () => {
		// GIVEN
		const pathnames = listerPages(PAGES_DIRECTORY).map(versPathname);

		// WHEN
		const pagesSansConfig = pathnames
			.filter((pathname) => !PAGES_SANS_FIL_D_ARIANE.includes(pathname))
			.filter((pathname) => !filDArianeConfig[pathname]);

		// THEN
		expect(pagesSansConfig).toEqual([]);
	});
});
