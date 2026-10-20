import React from "react";

const NOMBRE_ELEMENT_AVANT_ET_APRES_LA_CURRENT_PAGE = 4;

export interface PaginationProps {
	currentPage: number;
	onPageClick: (page: number) => void;
	numberOfPageList: number[];
	createURL?: (page: number) => string;
	isFirstPage: boolean;
	isLastPage: boolean;
	lastPage: number;
	maxPage?: number;
}

export function Pagination(props: PaginationProps) {
	const { onPageClick, createURL, isFirstPage, isLastPage, numberOfPageList, lastPage, currentPage, maxPage } = props;

	const computedNumberOfPageList = (maxPage && numberOfPageList.length > maxPage)
		? Array.from({ length: maxPage }, (_, i) => i)
		: numberOfPageList;
	const computedLastPage = (maxPage && numberOfPageList.length > maxPage) ? maxPage : lastPage;

	const handleClick = (event: React.MouseEvent, page: number, disabled: boolean) => {
		event.preventDefault();
		if (!disabled) {
			onPageClick(page);
		}
	};

	const displayPageLink = (page: number) => {
		const isCurrent = currentPage === page;
		return (
			<li key={page}>
				<a
					href={createURL ? createURL(page) : "#"}
					className="fr-pagination__link"
					aria-current={isCurrent || undefined}
					title={`Page ${page + 1}`}
					onClick={(event) => handleClick(event, page, isCurrent)}
				>
					{page + 1}
				</a>
			</li>
		);
	};

	const displayFirstPageLink = () => (
		<li>
			<a
				href={!isFirstPage ? createURL ? createURL(0) : '#' : undefined}
				className="fr-pagination__link fr-pagination__link--first"
				aria-disabled={isFirstPage}
				aria-label="Revenir à la première page"
				onClick={(event) => handleClick(event, 0, isFirstPage)}
			>
				Première page
			</a>
		</li>
	);

	const displayPreviousPageLink = () => (
		<li>
			<a
				href={!isFirstPage ? createURL ? createURL(currentPage - 1) : '#' : undefined}
				className="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label"
				aria-disabled={isFirstPage}
				aria-label="Revenir à la page précédente"
				onClick={(event) => handleClick(event, currentPage - 1, isFirstPage)}
			>
				Page précédente
			</a>
		</li>
	);

	const displayIntermediatePages = () => computedNumberOfPageList
		.filter((page) =>
			page >= currentPage - NOMBRE_ELEMENT_AVANT_ET_APRES_LA_CURRENT_PAGE
			&& page <= currentPage + NOMBRE_ELEMENT_AVANT_ET_APRES_LA_CURRENT_PAGE
			&& page !== computedLastPage
		)
		.map(displayPageLink);

	const displayEllipsis = () => {
		if (currentPage < computedLastPage - (NOMBRE_ELEMENT_AVANT_ET_APRES_LA_CURRENT_PAGE + 1)) {
			return <li key="ellipsis">…</li>;
		}
		return null;
	};

	const displayNextPageLink = () => (
		<li>
			<a
				href={!isLastPage ? createURL ? createURL(currentPage + 1) : '#' : undefined}
				className="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label"
				aria-disabled={isLastPage}
				aria-label="Aller à la page suivante"
				onClick={(event) => handleClick(event, currentPage + 1, isLastPage)}
			>
				Page suivante
			</a>
		</li>
	);

	const displayLastPageLink = () => (
		<li>
			<a
				href={!isLastPage ? createURL ? createURL(computedLastPage) : '#' : undefined}
				className="fr-pagination__link fr-pagination__link--last"
				aria-disabled={isLastPage}
				aria-label="Aller à la dernière page"
				onClick={(event) => handleClick(event, computedLastPage, isLastPage)}
			>
				Dernière page
			</a>
		</li>
	);

	if (numberOfPageList.length < 1) {
		return null;
	}

	return (
		<nav role="navigation" className="fr-pagination" aria-label="Pagination">
			<ul className="fr-pagination__list">
				{displayFirstPageLink()}
				{displayPreviousPageLink()}
				{displayIntermediatePages()}
				{displayEllipsis()}
				{displayPageLink(computedLastPage)}
				{displayNextPageLink()}
				{displayLastPageLink()}
			</ul>
		</nav>
	);
}
