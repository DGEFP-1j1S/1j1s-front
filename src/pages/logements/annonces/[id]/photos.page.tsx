import { GetServerSidePropsContext } from "next";
import React from "react";

import { Head } from "~/client/components/head/Head";
import ErrorUnavailableService from "~/client/components/layouts/Error/ErrorUnavailableService";
import { Image as ImageProps } from "~/client/components/props";
import { Image } from "~/client/components/ui/Img";
import useAnalytics from "~/client/hooks/useAnalytics";
import analytics from "~/pages/logements/annonces/[id]/photos.analytics";
import { AnnonceDeLogementContext, chargerAnnonceDeLogement } from "~/pages/logements/annonces/chargerAnnonceDeLogement";
import { GetServerSidePropsResult } from "~/server/errors/getServerSidePropsResultWithError";
import { AnnonceDeLogementSource, NOMS_DES_SOURCES } from "~/server/logements/domain/annonceDeLogement";

type PhotosAnnonce = {
	slug: string
	titre: string
	source: AnnonceDeLogementSource
	imageList: Array<ImageProps>
}

export type PagePhotosAnnonceLogementProps = {
	annonce: PhotosAnnonce
	isFeatureActive: true
} | {
	annonce?: never
	isFeatureActive: false
}

export default function PagePhotosAnnonceLogement({ annonce, isFeatureActive }: PagePhotosAnnonceLogementProps) {
	useAnalytics(analytics);

	if (!isFeatureActive) return <ErrorUnavailableService />;

	const { titre, source, imageList } = annonce;
	const nombreDePhotos = imageList.length;
	const pluriel = nombreDePhotos > 1 ? "s" : "";
	const diffuseur = NOMS_DES_SOURCES[source] ?? "le diffuseur";
	const sansDescription = imageList.every((image) => !image.alt);

	return (
		<>
			<Head
				title={`Photos - ${titre} | 1jeune1solution`}
				robots="noindex"
			/>
			<main id="contenu" className="fr-container fr-py-4w">
				<h1>Photos du logement</h1>
				<p className="fr-text--lead">{titre}</p>
				{nombreDePhotos === 0
					? <p>Aucune photo pour ce logement</p>
					: (
						<>
							<p>
								{nombreDePhotos} photo{pluriel} fournie{pluriel} par {diffuseur}{sansDescription && ", sans description"}.
							</p>
							<ul className="fr-grid-row fr-grid-row--gutters list-style-none fr-p-0">
							{imageList.map((image, index) => (
								<li key={`${index}-${image.src}`} className="fr-col-12 fr-col-md-6 fr-col-lg-4">
									<Image
										src={image.src}
										alt={image.alt || ""}
										width={800}
										height={450}
										className="fr-responsive-img fr-ratio-16x9 img-cover" />
								</li>
							))}
						</ul>
						</>
					)}
			</main>
		</>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext<AnnonceDeLogementContext>): Promise<GetServerSidePropsResult<PagePhotosAnnonceLogementProps>> {
	return chargerAnnonceDeLogement(context, ({ imageList, source, titre }, slug) => ({
		annonce: {
			imageList: JSON.parse(JSON.stringify(imageList)),
			slug,
			source,
			titre,
		},
	}));
}
