import React, { useId, useState } from 'react';

import styles
	from '~/client/components/features/Logement/FormulaireRecherche/FormulaireRechercheAnnonceLogement.module.scss';
import { ButtonComponent } from '~/client/components/ui/Button/ButtonComponent';
import { FilterAccordion } from '~/client/components/ui/FilterAccordion/FilterAccordion';
import { Icon } from '~/client/components/ui/Icon/Icon';
import {
	MeilisearchCheckboxList,
} from '~/client/components/ui/Meilisearch/MeilisearchCheckboxList/MeilisearchCheckboxList';
import { MeilisearchInput } from '~/client/components/ui/Meilisearch/MeilisearchInput/MeilisearchInput';
import { MeilisearchRange } from '~/client/components/ui/Meilisearch/MeilisearchRange/MeilisearchRange';
import {
	MeilisearchRangeForModal,
} from '~/client/components/ui/Meilisearch/MeilisearchRange/MeilisearchRangeForModal';
import {
	MeilisearchSelectMultiple,
} from '~/client/components/ui/Meilisearch/MeilisearchSelectMultiple/MeilisearchSelectMultiple';
import { ModalComponent } from '~/client/components/ui/Modal/ModalComponent';

export const PRIX_MINIMUM = 0;
export const PRIX_MAXIMUM = 3000;
export const SURFACE_MINIMUM = 0;
export const SURFACE_MAXIMUM = 500;
export const DEVISE = '€';
export const UNITE_SURFACE = 'm²';

export function FormulaireRechercheAnnonceLogement() {
	const [isFiltresAvancésMobileOpen, setIsFiltresAvancésMobileOpen] = useState(false);
	const idTypeOffreTitre = useId();
	const idTypeBienTitre = useId();
	const idPrixTitre = useId();
	const idSurfaceTitre = useId();

	return (
		<form
			className={styles.RechercherLogementForm}
			role="search"
			onSubmit={(event) => event.preventDefault()}>
			<MeilisearchInput
				className={styles.inputVille}
				label="Ville"
				name="ville"
				placeholder="Exemples : Paris, Toulouse" />
			<MeilisearchSelectMultiple
				className={styles.filtresDesktop}
				attribute="type"
				label="Type d‘offre"
				sortBy={['name:asc']} />
			<MeilisearchSelectMultiple
				className={styles.filtresDesktop}
				attribute="typeBien"
				label="Type de bien"
				sortBy={['name:asc']} />
			<MeilisearchRange
				className={styles.filtresDesktop}
				attribute="surface"
				label="Surface (m²)"
				placeholder="Surface"
				unite={UNITE_SURFACE}
				min={SURFACE_MINIMUM}
				max={SURFACE_MAXIMUM} />
			<MeilisearchRange
				className={styles.filtresDesktop}
				attribute="prix"
				label="Prix"
				placeholder="Fourchette de prix"
				unite={DEVISE}
				min={PRIX_MINIMUM}
				max={PRIX_MAXIMUM} />
			<div className={styles.filtresAvancesMobile}>
				<ButtonComponent
					type="button"
					appearance="quaternary"
					icon={<Icon name="filter" />}
					iconPosition="right"
					label="Filtrer ma recherche"
					onClick={() => setIsFiltresAvancésMobileOpen(true)} />
				<ModalComponent
					className={isFiltresAvancésMobileOpen ? styles.show : styles.hide}
					close={() => setIsFiltresAvancésMobileOpen(false)}
					closeTitle="Fermer les filtres"
					isOpen={isFiltresAvancésMobileOpen}
					keepModalMounted
					aria-labelledby="dialog_label">
					<ModalComponent.Title>
						<Icon name="menu" />
						<span id="dialog_label">Filtrer ma recherche</span>
					</ModalComponent.Title>
					<ModalComponent.Content className={styles.filtresAvancésModalContenu}>
						<FilterAccordion open>
							<FilterAccordion.Title id={idTypeOffreTitre}>Type d‘offre</FilterAccordion.Title>
							<FilterAccordion.Content>
								<fieldset aria-labelledby={idTypeOffreTitre}>
									<MeilisearchCheckboxList
										attribute="type"
										label="Type d‘offre"
										sortBy={['name:asc']} />
								</fieldset>
							</FilterAccordion.Content>
						</FilterAccordion>
						<FilterAccordion>
							<FilterAccordion.Title id={idTypeBienTitre}>Type de bien</FilterAccordion.Title>
							<FilterAccordion.Content>
								<fieldset aria-labelledby={idTypeBienTitre}>
									<MeilisearchCheckboxList
										attribute="typeBien"
										label="Type de bien"
										sortBy={['name:asc']} />
								</fieldset>
							</FilterAccordion.Content>
						</FilterAccordion>
						<FilterAccordion>
							<FilterAccordion.Title id={idPrixTitre}>Prix</FilterAccordion.Title>
							<FilterAccordion.Content>
								<MeilisearchRangeForModal
									aria-labelledby={idPrixTitre}
									attribute="prix"
									nomDeLUnite="Euro"
									unite="€"
									min={PRIX_MINIMUM}
									max={PRIX_MAXIMUM} />
							</FilterAccordion.Content>
						</FilterAccordion>
						<FilterAccordion>
							<FilterAccordion.Title id={idSurfaceTitre}>Surface</FilterAccordion.Title>
							<FilterAccordion.Content>
								<MeilisearchRangeForModal
									aria-labelledby={idSurfaceTitre}
									attribute="surface"
									nomDeLUnite="Mètre carré"
									unite="m²"
									min={SURFACE_MINIMUM}
									max={SURFACE_MAXIMUM} />
							</FilterAccordion.Content>
						</FilterAccordion>
					</ModalComponent.Content>
					<ModalComponent.Footer>
						<div className={styles.applyFiltersButton}>
							<ButtonComponent
								icon={<Icon name="angle-right" />}
								iconPosition="right"
								label="Appliquer les filtres"
								onClick={() => setIsFiltresAvancésMobileOpen(false)} />
						</div>
					</ModalComponent.Footer>
				</ModalComponent>
			</div>
		</form>
	);
}
