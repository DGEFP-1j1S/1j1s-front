import React from 'react';

import { Head } from '~/client/components/head/Head';
import useSanitize from '~/client/hooks/useSanitize';
import { MesureEmployeur } from '~/server/mesures-employeurs/domain/mesureEmployeur';
import { Carte } from "~/client/dsfr";
import MarkdownToHtml from "~/client/components/ui/MarkdownToHtml/MarkdownToHtml";
import { Banner } from "~/client/components/ui/Hero/Hero";

export interface MesuresEmployeursProps {
	mesureEmployeurList: Array<MesureEmployeur>;
}

export function MesuresEmployeursComponent({ mesureEmployeurList }: MesuresEmployeursProps) {
	return (
		<>
			<Head
				title="Mesures Employeurs | 1jeune1solution"
				description="Plus de 400 000 offres d‘emplois et d‘alternances sélectionnées pour vous"
				robots="index,follow" />
			<main id="contenu">
				<Banner>
					<h1>
						Je découvre toutes les mesures du plan 1 jeune 1 solution pour m‘aider à recruter plus facilement
					</h1>
				</Banner>
				<section className='fr-container fr-mb-4w'>
					<ul className='fr-grid-row fr-grid-row--gutters'>
						{mesureEmployeurList.map((mesureEmployeur, index) => (
							<li key={index} className="fr-col-lg-4 fr-col-md-6 fr-col-12">
								<MesureEmployeurCard mesureEmployeur={mesureEmployeur} />
							</li>
						))}
					</ul>
				</section>
			</main>
		</>
	);
}

interface MesureEmployeurCardProps {
	mesureEmployeur: MesureEmployeur;
}

function MesureEmployeurCard({ mesureEmployeur }: MesureEmployeurCardProps) {
	const {
		banniere,
		link,
		pourQui,
		titre: dirtyTitre,
	} = mesureEmployeur;
	const titre = useSanitize(dirtyTitre);

	return (
		<Carte
			titre={titre}
			titreAs={'h2'}
			imageSrc={banniere?.src ?? '/images/image-par-defaut-carte.webp'}
			imageAlt={banniere?.alt ?? ""}
			lien={link}
			descriptionAs="div"
		>
			<MarkdownToHtml markdown={pourQui} />
		</Carte>
	);
}
