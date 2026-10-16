import "~/test-utils";

import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { DependenciesProvider } from "~/client/context/dependenciesContainer.context";
import { aCookiesService } from "~/client/services/cookies/cookies.service.fixture";

import { Footer } from "./Footer";

describe("Footer DSFR", () => {
	it("ouvre le panneau de gestion des cookies", async () => {
		const user = userEvent.setup();
		const cookiesService = aCookiesService();
		render(
			<DependenciesProvider cookiesService={cookiesService}>
				<Footer />
			</DependenciesProvider>,
		);

		await user.click(screen.getByRole("button", { name: "Gestion des cookies" }));

		expect(cookiesService.openPanel).toHaveBeenCalledTimes(1);
	});
});
