import React from 'react';

import { OffreDeStageIndexée } from '~/client/components/features/OffreDeStage/OffreDeStageIndexee';
import { HitProps } from '~/client/components/layouts/InstantSearch/InstantSearchLayout';
import { Carte } from '~/client/dsfr';
import { getCapitalizedItems } from '~/client/components/ui/Meilisearch/getCapitalizedItems';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import { DateService } from '~/client/services/date/date.service';
import { DomainesStage } from '~/server/stages/repository/domainesStage';

export function OffreDeStage(props: HitProps<OffreDeStageIndexée>) {
	const stage = props.hit;
	const dateService = useDependency<DateService>('dateService');

	function formatDate(dateDebutMin: string, dateDebutMax?: string) {
		if (!dateDebutMax || dateDebutMin === dateDebutMax) return `Débute le ${dateService.formatToHumanReadableDate(new Date(dateDebutMin))}`;

		return `Débute entre le ${dateService.formatToHumanReadableDate(new Date(dateDebutMin))} et le ${dateService.formatToHumanReadableDate(new Date(dateDebutMax))}`;
	}

	const listeEtiquettes: Array<string> = stage.domaines
		? stage.domaines
			.filter((domaine) => domaine !== DomainesStage.NON_RENSEIGNE)
			.map((domaine) => getCapitalizedItems(domaine))
		: [];

	const etiquetteLocalisation = stage.localisation?.ville || stage.localisation?.departement || stage.localisation?.region;
	if (etiquetteLocalisation) {
		listeEtiquettes.push(etiquetteLocalisation);
	}

	if (stage.dureeCategorisee && stage.dureeCategorisee !== 'Non renseigné') {
		listeEtiquettes.push(stage.dureeCategorisee);
	}

	if (stage.dateDeDebutMin) {
		listeEtiquettes.push(formatDate(stage.dateDeDebutMin, stage.dateDeDebutMax));
	}

	return (
		<Carte
			lien={`/stages/${stage.slug}`}
			titre={stage.titre}
			tags={listeEtiquettes}>
			{stage.nomEmployeur}
		</Carte>
	);
}
