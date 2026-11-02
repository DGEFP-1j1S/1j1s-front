import React from 'react';
import Image from "next/image";

interface CitationProps {
	citation: string
	lienSource?: string
	auteurice?: string
	imageSrc?: string
	imageAlt?: string
	detailsSource?: React.ReactNode[]
}

export function Citation({
	citation,
	lienSource,
	auteurice,
	imageSrc,
	imageAlt = "",
	detailsSource,
}: React.PropsWithChildren<CitationProps>) {
	return (
		<figure className={`fr-quote ${imageSrc ? 'fr-quote--column' : ''}`}>
			<blockquote cite={lienSource ?? ""}>
				<p>{citation}</p>
			</blockquote>
			<figcaption>
				{auteurice && <p className="fr-quote__author">{auteurice}</p>}
				{detailsSource &&
					<ul className="fr-quote__source">
						{detailsSource.map((detail, index) => (
							<li key={index}>{detail}</li>
						))}
					</ul>
				}
				{imageSrc && (
					<div className="fr-quote__image">
						<Image className="fr-responsive-img" src={imageSrc} alt={imageAlt }/>
					</div>
				)}
			</figcaption>
		</figure>
	);
}
