import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import React from "react";

import { MeilisearchRange } from "~/client/components/ui/Meilisearch/MeilisearchRange/MeilisearchRange";
import {
	mockUseRangeInput,
} from "~/client/components/ui/Meilisearch/mockMeilisearchUseFunctions";

import { useRange } from "react-instantsearch";
import { RangeBoundaries } from "instantsearch.js/es/connectors/range/connectRange";
vi.mock("react-instantsearch");

const spyOnUseRange = vi.mocked(useRange);

let refineMock: ReturnType<typeof vi.fn<(rangeValue: RangeBoundaries) => void>>;

const renderMeilisearchRange = () => {
	render(
		<MeilisearchRange
			attribute="test"
			labelMinimum="Test minimum"
			labelMaximum="Test maximum"
			unite="u"
			min={20}
			max={200} />,
	);
};

describe("<MeilisearchRange/>", () => {
	beforeEach(() => {
		refineMock = vi.fn<(rangeValue: RangeBoundaries) => void>();
		spyOnUseRange.mockImplementation(() => mockUseRangeInput({
			refine: refineMock,
		}));
	});

	it("affiche deux champs de type number avec l'unité dans le label", () => {
		// GIVEN / WHEN
		renderMeilisearchRange();

		// THEN
		const inputMin = screen.getByRole("spinbutton", { name: "Test minimum (u)" });
		const inputMax = screen.getByRole("spinbutton", { name: "Test maximum (u)" });
		expect(inputMin).toBeVisible();
		expect(inputMax).toBeVisible();
	});

	describe("quand on renseigne les champs minimum et maximum", () => {
		it("appelle la fonction refine avec les valeurs renseignées", async () => {
			// GIVEN
			const user = userEvent.setup();
			renderMeilisearchRange();

			// WHEN
			await user.type(screen.getByRole("spinbutton", { name: "Test minimum (u)" }), "12");
			await user.type(screen.getByRole("spinbutton", { name: "Test maximum (u)" }), "50");
			await user.tab();

			// THEN
			expect(refineMock).toHaveBeenCalledTimes(2);
			expect(refineMock).toHaveBeenLastCalledWith([12, 50]);
		});
	});

	describe("quand on renseigne seulement le champ minimum", () => {
		it("appelle la fonction refine avec la valeur min et undefined pour le max", async () => {
			// GIVEN
			const user = userEvent.setup();
			renderMeilisearchRange();

			// WHEN
			await user.type(screen.getByRole("spinbutton", { name: "Test minimum (u)" }), "12");
			await user.tab();

			// THEN
			expect(refineMock).toHaveBeenCalledTimes(1);
			expect(refineMock).toHaveBeenCalledWith([12, undefined]);
		});
	});

	describe("quand on renseigne seulement le champ maximum", () => {
		it("appelle la fonction refine avec la valeur max et undefined pour le min", async () => {
			// GIVEN
			const user = userEvent.setup();
			renderMeilisearchRange();

			// WHEN
			await user.type(screen.getByRole("spinbutton", { name: "Test maximum (u)" }), "50");
			await user.tab();

			// THEN
			expect(refineMock).toHaveBeenCalledTimes(1);
			expect(refineMock).toHaveBeenCalledWith([undefined, 50]);
		});
	});
});
