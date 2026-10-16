import classNames from 'classnames';
import React, { useCallback, useState } from 'react';

import {
	ModalDemandeDeContactAccompagnement,
} from '~/client/components/features/Accompagnement/DemandeDeContact/ModalDemandeDeContactAccompagnement';
import {
	HorairesResultatRechercherAccompagnement,
} from '~/client/components/features/Accompagnement/Rechercher/Résultat/Horaires/HorairesResultatRechercherAccompagnement';
import {
	RésultatRechercherAccompagnementTagsList,
} from '~/client/components/features/Accompagnement/Rechercher/Résultat/RésultatRechercherAccompagnementTagsList';
import {
	useAccompagnementLogo,
} from '~/client/components/features/Accompagnement/Rechercher/Résultat/useAccompagnementLogo';
import { ButtonComponent } from '~/client/components/ui/Button/ButtonComponent';
import { Card } from '~/client/components/ui/Card/Card';
import { Link } from '~/client/components/ui/Link/Link';
import {
	EtablissementAccompagnement,
	TypeÉtablissement,
} from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';

import styles from './RésultatRechercherAccompagnement.module.scss';

export interface RésultatRechercherAccompagnementProps {
	etablissement: EtablissementAccompagnement
}

interface ContactButtonProps {
	onClick: () => void
}

function ContactButton({ onClick }: ContactButtonProps) {
	const label = 'Je souhaite être contacté(e)';
	return (
		<>
			<ButtonComponent
				className={classNames(styles.contactFormulaireÉtablissement, styles.contactFormulaireÉtablissementDesktopOnly)}
				label={label}
				appearance={'quaternary'}
				onClick={onClick} />

			<ButtonComponent
				className={classNames(styles.contactFormulaireÉtablissement, styles.contactFormulaireÉtablissementMobileOnly)}
				label={label}
				appearance={'primary'}
				onClick={onClick} />
		</>
	);
}

interface MailLinkProps {
	email: string
}

function MailLink({ email }: MailLinkProps) {
	const label = 'Contacter l‘agence';
	const mailTo = `mailto:${email}`;
	const title = `${label} - adresse mail`;

	return (
		<>
			<Link
				appearance={'asQuaternaryButton'}
				href={mailTo}
				className={classNames(styles.contactMailÉtablissement, styles.contactMailÉtablissementDesktop)}
				title={title}>
				{label}
				<Link.Icon name="mail" />
			</Link>
			<Link
				appearance={'asPrimaryButton'}
				href={mailTo}
				className={classNames(styles.contactMailÉtablissement, styles.contactMailÉtablissementMobile)}
				title={title}>
				{label}
				<Link.Icon name="mail" />
			</Link>
		</>
	);
}

export function RésultatRechercherAccompagnement({ etablissement }: RésultatRechercherAccompagnementProps) {

	const isMissionLocale = etablissement.type === TypeÉtablissement.MISSION_LOCALE;
	const [isPopInOpen, setIsPopInOpen] = useState(false);
	const logoÉtablissement = useAccompagnementLogo(etablissement.type);
	const adresse = etablissement.adresse;

	const openContactÉtablissementModal = useCallback(() => {
		setIsPopInOpen(true);
	}, []);

	return (
		<>
			<Card layout={'vertical'} className={styles.card}>
				<Card.Content className={styles.content}>
					<Card.Image className={styles.logo} src={logoÉtablissement} height={108} width={108} alt="" />
					<div className={styles.mainInfoEtablissement}>
						<Card.Title className={styles.title} titleAs={'h3'}>
							{etablissement.nom}
						</Card.Title>
						{adresse && <span className={styles.address}>{`${adresse.numeroVoie}, ${adresse.codePostal} ${adresse.nomCommune}`}</span>}
					</div>
					<RésultatRechercherAccompagnementTagsList etablissement={etablissement} />

					{etablissement.horaires && etablissement.horaires.length > 0 && (
						<details className={styles.details}>
							<summary className={styles.summary}>Voir les horaires d‘ouverture</summary>
							<div className={styles.horaireBackground}>
								<ol className={styles.listeHoraire}>
									{etablissement.horaires.map((horaire) => (
										<li key={horaire.jour} className={styles.horaireElement}>
											<HorairesResultatRechercherAccompagnement horaire={horaire} />
										</li>
									))}
								</ol>
							</div>
						</details>
					)}

					{
						etablissement.email && (isMissionLocale ? <ContactButton onClick={openContactÉtablissementModal} />
							: <MailLink email={etablissement.email} />)
					}
				</Card.Content>
			</Card>
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
