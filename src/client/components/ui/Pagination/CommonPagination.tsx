import React from 'react';

import { Icon } from '~/client/components/ui/Icon/Icon';
import styles from '~/client/components/ui/Pagination/Pagination.module.scss';
import useBreakpoint from '~/client/hooks/useBreakpoint';

const NOMBRE_ELEMENT_SUR_MOBILE_AVANT_ET_APRES_LA_CURRENT_PAGE = 2;
const NOMBRE_ELEMENT_SUR_DESKTOP_AVANT_ET_APRES_LA_CURRENT_PAGE = 4;

export interface CommonPaginationProps {
	currentPage: number
	onPageClick: (page: number) => void
	numberOfPageList: number[]
	createURL?: (page: number) => string
	isFirstPage: boolean
	isLastPage: boolean
	lastPage: number
	maxPage?: number
}

export function CommonPagination(props: CommonPaginationProps) {
	const { onPageClick, createURL, isFirstPage, isLastPage, numberOfPageList, lastPage, currentPage, maxPage } = props;
	const { isSmallScreen } = useBreakpoint();
	const numberOfElementToDisplayAfterAndBeforeCurrentPage = isSmallScreen && NOMBRE_ELEMENT_SUR_MOBILE_AVANT_ET_APRES_LA_CURRENT_PAGE || NOMBRE_ELEMENT_SUR_DESKTOP_AVANT_ET_APRES_LA_CURRENT_PAGE;

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const computedNumberOfPageList = (maxPage && numberOfPageList.length > maxPage) ? [...Array(maxPage).keys()] : numberOfPageList;
	const computedLastPage = (maxPage && numberOfPageList.length > maxPage) ? maxPage : lastPage;

	const displayElement = (page: number) => {
		return (
			<li key={page}>
				<a
					href={createURL ? createURL(page) : '#'}
					className={'underline-none'}
					aria-current={currentPage === page}
					onClick={(event) => {
						event.preventDefault();
						if (page !== currentPage) {
							onPageClick(page);
						}
					}}>
					{page + 1}
				</a>
			</li>
		);
	};

	const displayPrevious = () => {
		return (
			<>
				<li key="FirstPageLiPagination">
					<a
						href={createURL ? createURL(0) : '#'}
						className={'underline-none'}
						aria-disabled={isFirstPage}
						aria-label="Revenir à la première page"
						onClick={(event) => {
							event.preventDefault();
							if (!isFirstPage) {
								onPageClick(0);
							}
						}}>
						<Icon name={'angle-left-from-line'} />
					</a>
				</li>
				<li key="PreviousPageLiPagination">
					<a
						href={createURL ? createURL(currentPage - 1) : '#'}
						className={'underline-none'}
						aria-disabled={isFirstPage}
						aria-label="Revenir à la page précédente"
						onClick={(event) => {
							event.preventDefault();
							if (!isFirstPage) {
								onPageClick(currentPage - 1);
							}
						}}>
						{isSmallScreen ? <Icon name={'angle-left'} /> : <><Icon name={'angle-left'} /> <span>Page précédente</span></>}
					</a>
				</li>
			</>
		);
	};

	const displayIntermediatePages = () => computedNumberOfPageList.filter((element) =>
		element >= currentPage - numberOfElementToDisplayAfterAndBeforeCurrentPage && element <= currentPage + numberOfElementToDisplayAfterAndBeforeCurrentPage && element !== computedLastPage,
	).map(displayElement);

	const displayEllipsis = () => currentPage < computedLastPage - (numberOfElementToDisplayAfterAndBeforeCurrentPage + 1)
		? <li className={styles.ellipse}>…</li> : <></>;

	const displayNext = () => {
		return (
			<>
				{displayElement(computedLastPage)}
				<li key="NextPageLiPagination">
					<a
						href={createURL ? createURL(currentPage + 1) : '#'}
						className={'underline-none'}
						aria-disabled={isLastPage}
						aria-label="Aller à la page suivante"
						onClick={(event) => {
							event.preventDefault();
							if (!isLastPage) {
								onPageClick(currentPage + 1);
							}
						}}>
						{isSmallScreen ? <Icon name={'angle-right'} /> : <><span>Page suivante</span> <Icon name={'angle-right'} /></>}
					</a>
				</li>
				<li key="LastLiPagination">
					<a
						href={createURL ? createURL(computedLastPage) : '#'}
						className={'underline-none'}
						aria-disabled={isLastPage}
						aria-label="Aller à la dernière page"
						onClick={(event) => {
							event.preventDefault();
							if (!isLastPage) {
								onPageClick(computedLastPage);
							}
						}}>
						<Icon name={'angle-right-from-line'} />
					</a>
				</li>
			</>
		);
	};

	return (
		<>
			{
				numberOfPageList.length >= 1
				&& (
					<nav role="navigation" aria-label="pagination">
          	<ul key="Pagination" className={styles.pagination}>
          		{displayPrevious()}
          		{displayIntermediatePages()}
          		{displayEllipsis()}
          		{displayNext()}
          	</ul>
					</nav>
				)}
		</>
	);
};
