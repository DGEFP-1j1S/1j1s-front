import React, { useState } from 'react';
import { useInstantSearch } from 'react-instantsearch';

import ErrorUnavailableService from '~/client/components/layouts/Error/ErrorUnavailableService';

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export const InstantSearchErrorBoundary = (props: React.PropsWithChildren<ErrorBoundaryProps>) => {
	const { error } = useInstantSearch({ catchError: true });
	const { children } = props;
	const [uneErreurEstSurvenue, setUneErreurEstSurvenue] = useState(false);

	if (error && !uneErreurEstSurvenue) {
		setUneErreurEstSurvenue(true);
	}

	if (uneErreurEstSurvenue) return <ErrorUnavailableService />;

	return <>{ children }</>;
};
