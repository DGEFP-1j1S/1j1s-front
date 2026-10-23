import React from 'react';

import { BackButton } from '~/client/components/features/ButtonRetour/BackButton';
import { Image } from '~/client/components/ui/Img';
import { Link } from '~/client/components/ui/Link/Link';


interface ErrorLayoutProps {
	title: string
	errorCode: string
	subTitle: string
	content: string
}

export function ErrorLayout(props: React.PropsWithChildren<ErrorLayoutProps>) {
	const { title, errorCode, subTitle, content } = props;

	return (
		<div className="fr-container fr-my-8w">
			<div className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-grid-row--center">
				<div className="fr-col-9">
					<h1>{title}</h1>
					<p className="fr-text--sm fr-mb-3w">Erreur {errorCode}</p>
					<p className="fr-text--lead fr-mb-3w">{subTitle}</p>
					<p className="fr-text--sm fr-mb-5w">{content}</p>
					<div className="fr-btns-group fr-btns-group--inline-md">
						<BackButton aria-label="Retourner à la page précédente" label="Retourner à la page précédente"/>
						<Link href="/" className="fr-btn fr-btn--secondary">Aller à l‘accueil</Link>
					</div>
				</div>
				<div className="fr-col-3 fr-hidden fr-unhidden-lg">
					<Image src="/images/logos/technical-error.svg" alt="" width={185} height={205}/>
				</div>
			</div>
		</div>
	);
}
