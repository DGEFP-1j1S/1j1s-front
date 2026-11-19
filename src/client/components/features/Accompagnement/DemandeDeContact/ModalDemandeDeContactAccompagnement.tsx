import React, { useId } from 'react';

import {
	FormulaireDemandeDeContactAccompagnement,
} from '~/client/components/features/Accompagnement/DemandeDeContact/Formulaire/FormulaireDemandeDeContactAccompagnement';
import { Button, Modal } from "~/client/dsfr";
import { Link } from '~/client/components/ui/Link/Link';
import {
	ContactEtablissementAccompagnement,
} from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';

interface ModalDemandeDeContactAccompagnementProps {
	contactÉtablissementAccompagnement: ContactEtablissementAccompagnement
	modaleId: string
}

export function ModalDemandeDeContactAccompagnement({ contactÉtablissementAccompagnement, modaleId }: ModalDemandeDeContactAccompagnementProps) {

	const modaleSuccesId = `modale-formulaire-succes-${useId().replace(/:/g, '')}`;
	const modaleEchecId = `modale-formulaire-echec-${useId().replace(/:/g, '')}`;

	return (
		<>
			<Modal
				id={modaleId}
				titre="Formulaire de contact"
			>
				<h1>Je souhaite être contacté(e) par la Mission Locale</h1>
				<p className="fr-text--sm">Tous les champs sont obligatoires sauf mention contraire</p>
				<FormulaireDemandeDeContactAccompagnement
					contactEtablissementAccompagnement={contactÉtablissementAccompagnement}
					onSuccess={() => ouvrirModal(modaleSuccesId)}
					onFailure={() => ouvrirModal(modaleEchecId)}
				/>
			</Modal>

			<Modal id={modaleSuccesId} titre="">
				<div className="text-align--center">
					<h1 className="fr-h2">Votre demande a bien été transmise !</h1>
				</div>
			</Modal>

			<Modal id={modaleEchecId} titre="">
				<div className="text-align--center">
					<h1 className="fr-h2">Une erreur est survenue lors de l‘envoi du formulaire</h1>
					<Button className="fr-btn fr-mr-2w" label="Retour au formulaire" data-fr-opened="false"
									aria-controls={modaleId} type="button"/>
					<Link className="fr-btn fr-btn--secondary" href="/">
						Aller à l‘accueil
					</Link>
				</div>
			</Modal>
		</>
	);

	const ouvrirModal = (modalId: string) => {
		const modal = document.getElementById(modalId);

		if (modal && window.dsfr) {
			window.dsfr(modal)?.modal?.disclose();
		}
	};
}
