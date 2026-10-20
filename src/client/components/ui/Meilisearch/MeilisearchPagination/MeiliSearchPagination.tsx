import classNames from 'classnames';
import React, { useMemo } from 'react';
import { usePagination } from 'react-instantsearch';
import type { UsePaginationProps } from 'react-instantsearch';

import { Pagination as DSFRPagination } from "~/client/dsfr";

interface MeilisearchPaginationProps extends Pick<React.HTMLAttributes<unknown>, 'className'> {
  numberOfResultPerPage: number
  onPageChange: () => void
}

export function MeiliSearchPagination(props: MeilisearchPaginationProps & UsePaginationProps) {
	const { numberOfResultPerPage, onPageChange, className } = props;
	const {
		currentRefinement,
		nbHits,
		isFirstPage,
		isLastPage,
		refine,
		createURL,
	} = usePagination(props);
	const numberOfResult = nbHits;

	const numberOfPageList = useMemo(() => {
		if (nbHits > 0) {
			return [...Array(Math.ceil(nbHits / numberOfResultPerPage) - 1)].map((value, index) => index);
		}
		return [];
	}, [nbHits, numberOfResultPerPage]);
	const lastPage = Math.max((Math.ceil(numberOfResult / numberOfResultPerPage) - 1), 0);



	const onPageClick = (pageNumber: number) => {
		refine(pageNumber);
		onPageChange();
	};

	return (
		<div className={classNames(className)}>
			<DSFRPagination
				currentPage={currentRefinement}
				onPageClick={onPageClick}
				isLastPage={isLastPage}
				numberOfPageList={numberOfPageList}
				lastPage={lastPage}
				isFirstPage={isFirstPage}
				createURL={createURL} />
		</div>
	);
}

