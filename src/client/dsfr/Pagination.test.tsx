import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import React from "react";

import { Pagination, PaginationProps } from "./Pagination";

function aPaginationProps(overrides?: Partial<PaginationProps>): PaginationProps {
	return {
		currentPage: 2,
		isFirstPage: false,
		isLastPage: false,
		lastPage: 4,
		numberOfPageList: [0, 1, 2, 3, 4],
		onPageClick: vi.fn(),
		...overrides,
	};
}

describe("Pagination DSFR", () => {
	describe("quand la pagination est affichée", () => {
		it("affiche une navigation avec le role navigation", () => {
			render(<Pagination {...aPaginationProps()} />);

			expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
		});

		it("affiche les liens de navigation premiere page, precedente, suivante, derniere page", () => {
			render(<Pagination {...aPaginationProps()} />);

			expect(screen.getByRole("link", { name: "Revenir à la première page" })).toBeInTheDocument();
			expect(screen.getByRole("link", { name: "Revenir à la page précédente" })).toBeInTheDocument();
			expect(screen.getByRole("link", { name: "Aller à la page suivante" })).toBeInTheDocument();
			expect(screen.getByRole("link", { name: "Aller à la dernière page" })).toBeInTheDocument();
		});

		it("marque la page courante avec aria-current", () => {
			render(<Pagination {...aPaginationProps({ currentPage: 2 })} />);

			expect(screen.getByRole("link", { current: true, name: "3" })).toBeInTheDocument();
		});
	});

	describe("quand on est sur la premiere page", () => {
		it("desactive les liens premiere page et page precedente", () => {
			render(<Pagination {...aPaginationProps({ currentPage: 0, isFirstPage: true })} />);

			expect(screen.getByText("Première page")).toHaveAttribute("aria-disabled", "true");
			expect(screen.getByText("Page précédente")).toHaveAttribute("aria-disabled", "true");
		});
	});

	describe("quand on est sur la derniere page", () => {
		it("desactive les liens page suivante et derniere page", () => {
			render(<Pagination {...aPaginationProps({ currentPage: 4, isLastPage: true })} />);

			expect(screen.getByText("Page suivante")).toHaveAttribute("aria-disabled", "true");
			expect(screen.getByText("Dernière page")).toHaveAttribute("aria-disabled", "true");
		});
	});

	describe("quand l utilisateur clique sur le numero de la page courante", () => {
		it("n appelle pas onPageClick", async () => {
			const user = userEvent.setup();
			const onPageClick = vi.fn();
			render(<Pagination {...aPaginationProps({ currentPage: 2, onPageClick })} />);

			await user.click(screen.getByRole("link", { current: true, name: "3" }));

			expect(onPageClick).not.toHaveBeenCalled();
		});
	});

	describe("quand l utilisateur clique sur le numero d une autre page", () => {
		it("appelle onPageClick avec cette page", async () => {
			const user = userEvent.setup();
			const onPageClick = vi.fn();
			render(<Pagination {...aPaginationProps({ currentPage: 2, onPageClick })} />);

			await user.click(screen.getByRole("link", { current: false, name: "4" }));

			expect(onPageClick).toHaveBeenCalledTimes(1);
			expect(onPageClick).toHaveBeenCalledWith(3);
		});
	});

	describe("quand la liste de pages est vide", () => {
		it("n affiche pas la pagination", () => {
			render(<Pagination {...aPaginationProps({ numberOfPageList: [] })} />);

			expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
		});
	});

	describe("quand il y a beaucoup de pages", () => {
		it("affiche une ellipse entre les pages intermediaires et la derniere page", () => {
			render(<Pagination {...aPaginationProps({
				currentPage: 0,
				lastPage: 15,
				numberOfPageList: Array.from({ length: 16 }, (_, i) => i),
			})} />);

			expect(screen.getByText("…")).toBeInTheDocument();
		});
	});
});
