import React from "react";

import { AnnonceDeLogementIndexee } from '~/server/logements/domain/annonceDeLogementIndexee';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import { Carte } from '~/client/dsfr';
import { DateService } from '~/client/services/date/date.service';

const TYPE_DE_LOGEMENT_INTERGENERATIONNEL = 'habitation intergénérationnelle';
const IMAGE_PAR_DEFAUT = "/images/image-par-defaut-carte.webp";

export function AnnonceDeLogement(props: { hit: AnnonceDeLogementIndexee }) {
	const annonce = props.hit;
	const typeDeLogement = annonce.type === TYPE_DE_LOGEMENT_INTERGENERATIONNEL ? 'intergénérationnel' : annonce.type;
	const dateService = useDependency<DateService>('dateService');
	const dateDeLAnnonce = dateService.formatToHumanReadableDate(new Date(annonce.dateDeMiseAJour));

	return (
		<Carte
			titre={annonce.titre}
			lien={`/logements/annonces/${annonce.slug}`}
			tags={[typeDeLogement, `postée le ${dateDeLAnnonce}`]}
			imageSrc={annonce.imagesUrl[0] ?? IMAGE_PAR_DEFAUT}
			descriptionAs="div"
		>
			<dl className="fr-pl-0">
				<Information label="Surface">{annonce.surfaceAAfficher}</Information>
				<Information label="Prix">{formatterPrix(annonce)}</Information>
				<Information label="Emplacement">{annonce.localisationAAfficher}</Information>
			</dl>
		</Carte>
	);
}

function formatterPrix({ prix, devise }: AnnonceDeLogementIndexee) {
	return prix > 0 ? `${prix} ${devise} charges comprises` : "non renseigné";
}

function Information({ label, children }: { label: string, children: React.ReactNode }) {
	return (
		<div className="fr-grid-row">
			<dt>{label} :</dt>
			<dd className="fr-pl-1v">{children}</dd>
		</div>
	);
}
