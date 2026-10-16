import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';


// NOTE (BRUJ 06/05/2024): Pour éviter les hydratation mismatch lié au usebreakpoint on désactive le srr sur des composants spécifiques cf https://nextjs.org/docs/messages/react-hydration-error#solution-2-disabling-ssr-on-specific-components
const CommonPagination = dynamic(() => import('./CommonPagination').then((mod) => mod.CommonPagination), { ssr: false });

interface PaginationProps {
	numberOfResult: number
	numberOfResultPerPage: number
	maxPage?: number
}

function getPageFromQuery(page: string | string[] | undefined): number {
	if (page && typeof page === 'string' && !isNaN(+page)) {
		return Number(page) - 1;
	}
	return 0;
}

export function Pagination({ numberOfResult, numberOfResultPerPage, maxPage }: PaginationProps) {
	const { query, push } = useRouter();
	const pageFromQuery = getPageFromQuery(query.page);
	const [currentPage, setCurrentPage] = useState(pageFromQuery);
	const [previousPageFromQuery, setPreviousPageFromQuery] = useState(pageFromQuery);
	if (pageFromQuery !== previousPageFromQuery) {
		setPreviousPageFromQuery(pageFromQuery);
		setCurrentPage(pageFromQuery);
	}

	async function setCurrentPageAndQueryUrl(page: number) {
		setCurrentPage(page);
		await push({ query: { ...query, page: page + 1 } });
	}

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const numberOfPageList = [...Array(Math.ceil(numberOfResult / numberOfResultPerPage) - 1).keys()];
	const isFirstPage = useMemo(() => currentPage === 0, [currentPage]);
	const isLastPage = useMemo(() => maxPage && numberOfPageList.length > maxPage ? currentPage === maxPage : currentPage === numberOfPageList.length, [currentPage, maxPage, numberOfPageList.length]);
	const lastPage = useMemo(() => Math.max((Math.ceil(numberOfResult / numberOfResultPerPage) - 1), 0), [numberOfResult, numberOfResultPerPage]);

	return (
		<CommonPagination
			currentPage={currentPage}
			onPageClick={setCurrentPageAndQueryUrl}
			isLastPage={isLastPage}
			numberOfPageList={numberOfPageList}
			lastPage={lastPage}
			isFirstPage={isFirstPage}
			maxPage={maxPage} />
	);
}
