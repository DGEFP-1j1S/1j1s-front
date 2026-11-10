import { useRouter } from "next/router";
import React from "react";

import { filDArianeConfig, FilDArianePageProps } from "~/client/components/layouts/FilDAriane/filDAriane.config";
import { Breadcrumb } from "~/client/dsfr";

interface FilDArianeProps {
	pageProps?: FilDArianePageProps;
}

export function FilDAriane({ pageProps = {} }: FilDArianeProps) {
	const { pathname } = useRouter();
	const entry = filDArianeConfig[pathname];
	if (!entry) return null;

	const label = typeof entry.label === "function" ? entry.label(pageProps) : entry.label;
	if (!label) return null;

	return (
		<div className="fr-container">
			<Breadcrumb items={[...entry.parents, { label }]} />
		</div>
	);
}
