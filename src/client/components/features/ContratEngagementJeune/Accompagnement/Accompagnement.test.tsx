import { render, screen } from "@testing-library/react";

import Accompagnement from "./Accompagnement";

describe("<Accompagnement />", () => {
	it("affiche le titre de la section, cible du lien du hero", () => {
		// GIVEN
		// WHEN
		render(<Accompagnement />);

		// THEN
		expect(screen.getByRole("heading", { level: 2, name: "Le Contrat d’Engagement Jeune, je me lance !" })).toHaveAttribute("id", "accompagnement");
	});

	it("affiche les trois situations possibles", () => {
		// GIVEN
		// WHEN
		render(<Accompagnement />);

		// THEN
		expect(screen.getByRole("link", { name: "Je suis accompagné(e) par France Travail" })).toBeVisible();
		expect(screen.getByRole("link", { name: "Je suis accompagné(e) par une Mission Locale" })).toBeVisible();
		expect(screen.getByRole("link", { name: "Je ne bénéficie d’aucun accompagnement" })).toBeVisible();
	});
});
