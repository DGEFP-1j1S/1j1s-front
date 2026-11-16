import React, { useCallback, useState } from 'react';

import {
	ModalDemandeDeContactAccompagnement,
} from '~/client/components/features/Accompagnement/DemandeDeContact/ModalDemandeDeContactAccompagnement';
import {
	HorairesResultatRechercherAccompagnement,
} from '~/client/components/features/Accompagnement/Rechercher/Resultat/Horaires/HorairesResultatRechercherAccompagnement';
import {
	RésultatRechercherAccompagnementTagsList,
} from '~/client/components/features/Accompagnement/Rechercher/Resultat/ResultatRechercherAccompagnementTagsList';
import { ButtonComponent } from '~/client/components/ui/Button/ButtonComponent';
import { Icon } from '~/client/components/ui/Icon/Icon';
import { Carte } from '~/client/dsfr';
import { Link } from '~/client/components/ui/Link/Link';
import {
	EtablissementAccompagnement,
	TypeEtablissement,
} from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';

export interface RésultatRechercherAccompagnementProps {
	etablissement: EtablissementAccompagnement
}

export function ResultatRechercherAccompagnement({ etablissement }: RésultatRechercherAccompagnementProps) {

	const isMissionLocale = etablissement.type === TypeEtablissement.MISSION_LOCALE;
	const [isPopInOpen, setIsPopInOpen] = useState(false);
	const adresse = etablissement.adresse;

	const openContactÉtablissementModal = useCallback(() => {
		setIsPopInOpen(true);
	}, []);

	return (
		<>
			<Carte titre={etablissement.nom}
						 className="carte-etablissement"
						 descriptionAs="div">
				<div className="contenu-etablissement">

				{ adresse &&
					<div className="fr-grid-row">
						<span className="fr-icon-road-map-line fr-col-1"/><p className="fr-col-11"><span className="fr-text--bold">&nbsp;Adresse&nbsp;:&nbsp;</span>{`${adresse.numeroVoie}, ${adresse.codePostal} ${adresse.nomCommune}`}</p>
					</div>}

				{ !isMissionLocale && etablissement.email &&
					<div className="fr-grid-row">
						<span className="fr-icon-mail-line fr-col-1"/><p className="fr-col-11"><span className="fr-text--bold">&nbsp;E-Mail&nbsp;:&nbsp;</span>{`${etablissement.email}`}</p>
					</div>}

				{ etablissement.telephone &&
					<div className="fr-grid-row">
						<span className="fr-icon-phone-line fr-col-1"/><p className="fr-col-11"><span className="fr-text--bold">&nbsp;Téléphone&nbsp;:&nbsp;</span><Link href={`tel:${etablissement.telephone}`}>{`${etablissement.telephone}`}</Link></p>
					</div>}

				{ etablissement.horaires && etablissement.horaires.length > 0 && (
					<div className="fr-grid-row">
						<span className="fr-icon-time-line fr-col-1"/><p className="fr-col-11"><span className="fr-text--bold">Horaires d'ouverture&nbsp;:&nbsp;</span>
					{etablissement.horaires.map((horaire) => <HorairesResultatRechercherAccompagnement horaire={horaire} />)}
					</p>
					</div>)}
				</div>

				<div className="fr-grid-row fr-grid-row--right fr-mt-auto">
					{ etablissement.telephone && <Link className="fr-btn fr-btn-primary fr-mr-2w" href={`tel:${etablissement.telephone}`}>Appeler</Link> }
					{ etablissement.email && (isMissionLocale ? <ButtonComponent className="fr-btn fr-btn--secondary" label="Être contacté.e" onClick={openContactÉtablissementModal} />
						: <Link className="fr-btn fr-btn--secondary" href={`mailto:${etablissement.email}`}>Contacter par mail</Link>) }
				</div>
			</Carte>
-
			{
				isMissionLocale && etablissement.email && (
					<ModalDemandeDeContactAccompagnement
						contactÉtablissementAccompagnement={{
							email: etablissement.email,
							nom: etablissement.nom,
							type: etablissement.type,
						}}
						isOpen={isPopInOpen}
						setIsOpen={setIsPopInOpen} />
				)}
		</>
	);

}
