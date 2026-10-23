import "~/test-utils";

import { render, screen, within } from "@testing-library/react";
import React from "react";

import { Breadcrumb } from "./Breadcrumb";

describe("Breadcrumb DSFR", () => {
	it("affiche un lien vers l'accueil en premier niveau", () => {
		// GIVEN
		const items = [{ label: "Emplois" }];

		// WHEN
		render(<Breadcrumb items={items} />);

		// THEN
		const navigation = screen.getByRole("navigation", { name: "vous êtes ici :" });
		const elements = within(navigation).getAllByRole("listitem");
		expect(elements[0]).toHaveTextContent("Accueil");
		expect(within(elements[0]).getByRole("link", { name: "Accueil" })).toHaveAttribute("href", "/");
	});

	it("affiche les niveaux intermédiaires sous forme de liens", () => {
		// GIVEN
		const items = [{ href: "/emplois", label: "Emplois" }, { label: "Développeur" }];

		// WHEN
		render(<Breadcrumb items={items} />);

		// THEN
		expect(screen.getByRole("link", { name: "Emplois" })).toHaveAttribute("href", "/emplois");
	});

	it("marque la page courante avec aria-current", () => {
		// GIVEN
		const items = [{ href: "/emplois", label: "Emplois" }, { label: "Développeur" }];

		// WHEN
		render(<Breadcrumb items={items} />);

		// THEN
		expect(screen.getByText("Développeur")).toHaveAttribute("aria-current", "page");
		expect(screen.queryByRole("link", { name: "Développeur" })).not.toBeInTheDocument();
	});

	it("doit être accessible", async () => {
		// GIVEN
		const items = [{ href: "/emplois", label: "Emplois" }, { label: "Développeur" }];

		// WHEN
		const { container } = render(<Breadcrumb items={items} />);

		// THEN
		await expect(container).toBeAccessible();
	});
});
