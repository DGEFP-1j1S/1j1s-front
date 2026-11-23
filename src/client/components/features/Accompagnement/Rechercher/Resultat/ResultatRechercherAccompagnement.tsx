import React, { useId} from 'react';

import {
	ModalDemandeDeContactAccompagnement,
} from '~/client/components/features/Accompagnement/DemandeDeContact/ModalDemandeDeContactAccompagnement';
import {
	HorairesResultatRechercherAccompagnement,
} from '~/client/components/features/Accompagnement/Rechercher/Resultat/Horaires/HorairesResultatRechercherAccompagnement';
import { Carte } from '~/client/dsfr';
import { Link } from '~/client/components/ui/Link/Link';
import { Button } from "~/client/dsfr";
import {
	EtablissementAccompagnement,
	TypeEtablissement,
} from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';


export interface RésultatRechercherAccompagnementProps {
	etablissement: EtablissementAccompagnement
}

export function ResultatRechercherAccompagnement({etablissement}: RésultatRechercherAccompagnementProps) {

	const isMissionLocale = etablissement.type === TypeEtablissement.MISSION_LOCALE;
	const adresse = etablissement.adresse;
	const modaleId = `modale-formulaire-contact-${useId().replace(/:/g, '')}`;

	return (
		<>
			<Carte
				titre={etablissement.nom}
				descriptionAs="div"
				footer={
					<div className="text-align--right">
						{etablissement.telephone &&
							<Link className="fr-btn fr-btn-primary fr-mr-2w" href={`tel:${etablissement.telephone}`}>Appeler</Link>}
						{etablissement.email && (isMissionLocale ?
							<Button className="fr-btn fr-btn--secondary" label="Être contacté.e" data-fr-opened="false"
											aria-controls={modaleId} type="button"/>
							: <Link className="fr-btn fr-btn--secondary" href={`mailto:${etablissement.email}`} title="Contacter par mail - adresse mail">Contacter par mail</Link>)}
					</div>
				}>
				<div>
					{adresse &&
						<div className="fr-grid-row">
							<span className="fr-icon-road-map-line fr-col-1"/><p className="fr-col-11"><span
							className="fr-text--bold">&nbsp;Adresse&nbsp;:&nbsp;</span>{`${adresse.numeroVoie}, ${adresse.codePostal} ${adresse.nomCommune}`}
						</p>
						</div>}

					{!isMissionLocale && etablissement.email &&
						<div className="fr-grid-row">
							<span className="fr-icon-mail-line fr-col-1"/><p className="fr-col-11"><span
							className="fr-text--bold">&nbsp;E-Mail&nbsp;:&nbsp;</span>{`${etablissement.email}`}</p>
						</div>}

					{etablissement.telephone &&
						<div className="fr-grid-row">
							<span className="fr-icon-phone-line fr-col-1"/><p className="fr-col-11"><span
							className="fr-text--bold">&nbsp;Téléphone&nbsp;:&nbsp;</span><Link
							href={`tel:${etablissement.telephone}`}>{`${etablissement.telephone}`}</Link></p>
						</div>}

					{etablissement.horaires && etablissement.horaires.length > 0 && (
						<div className="fr-grid-row">
							<span className="fr-icon-time-line fr-col-1"/><p className="fr-col-11"><span className="fr-text--bold">Horaires d&apos;ouverture&nbsp;:&nbsp;</span>
							{etablissement.horaires.map((horaire) => <span key={horaire.jour}><HorairesResultatRechercherAccompagnement horaire={horaire}/></span>)}
						</p>
						</div>)}
				</div>
			</Carte>

			{
				isMissionLocale && etablissement.email && (
					<ModalDemandeDeContactAccompagnement
						contactÉtablissementAccompagnement={{
							email: etablissement.email,
							nom: etablissement.nom,
							type: etablissement.type,
						}}
						modaleId={modaleId}/>
				)}
		</>
	);

}
