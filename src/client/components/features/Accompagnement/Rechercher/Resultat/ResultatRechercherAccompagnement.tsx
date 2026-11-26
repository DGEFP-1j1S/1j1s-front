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
						<p className="fr-icon-road-map-line">
							<span className="fr-text--bold">&nbsp;Adresse&nbsp;:&nbsp;</span>
							{`${adresse.numeroVoie}, ${adresse.codePostal} ${adresse.nomCommune}`}
						</p>
					}

					{!isMissionLocale && etablissement.email &&
						<p className="fr-icon-mail-line">
							<span className="fr-text--bold">&nbsp;E-Mail&nbsp;:&nbsp;</span>
							{`${etablissement.email}`}
						</p>
					}

					{etablissement.telephone &&
						<p className="fr-icon-phone-line">
							<span className="fr-text--bold">&nbsp;Téléphone&nbsp;:&nbsp;</span>
							<Link href={`tel:${etablissement.telephone}`}>{`${etablissement.telephone}`}</Link>
						</p>
					}

					{etablissement.horaires && etablissement.horaires.length > 0 && (
						<>
							<p className="fr-icon-time-line fr-mb-0"><span className="fr-text--bold">&nbsp;Horaires d&apos;ouverture&nbsp;:&nbsp;</span></p>
							<ul className="fr-ml-7v fr-raw-list flex flex--wrap">
								{etablissement.horaires.map((horaire) => <li key={horaire.jour}><HorairesResultatRechercherAccompagnement horaire={horaire}/></li>)}
							</ul>
						</>
					)}
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
