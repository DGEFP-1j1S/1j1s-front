import React, { Dispatch, SetStateAction, useState } from 'react';

import styles from '~/client/components/features/ContratEngagementJeune/Accompagnement/Accompagnement.module.scss';
import AutresBesoins
	from '~/client/components/features/ContratEngagementJeune/Accompagnement/Formulaires/AutresBesoins';
import BesoinAide from '~/client/components/features/ContratEngagementJeune/Accompagnement/Formulaires/BesoinAide';
import BesoinAide26ans
	from '~/client/components/features/ContratEngagementJeune/Accompagnement/Formulaires/BesoinAide26ans';
import Démarrage from '~/client/components/features/ContratEngagementJeune/Accompagnement/Formulaires/Démarrage';
import Handicap from '~/client/components/features/ContratEngagementJeune/Accompagnement/Formulaires/Handicap';
import PasDAccompagnement
	from '~/client/components/features/ContratEngagementJeune/Accompagnement/Formulaires/PasDAccompagnement';
import {
	ModaleDispositifsReferences,
} from '~/client/components/features/ContratEngagementJeune/Accompagnement/Modales/ModaleDispositifsReferences';
import {
	ModaleFranceTravail,
} from '~/client/components/features/ContratEngagementJeune/Accompagnement/Modales/ModaleFranceTravail';
import {
	ModaleInscriptionFranceTravail,
} from '~/client/components/features/ContratEngagementJeune/Accompagnement/Modales/ModaleInscriptionFranceTravail';
import {
	ModaleMissionLocale,
} from '~/client/components/features/ContratEngagementJeune/Accompagnement/Modales/ModaleMissionLocale';


export type Formulaires =
	'Démarrage'
	| 'PasDAccompagnement'
	| 'BesoinAide'
	| 'BesoinAide26ans'
	| 'AutresBesoins'
	| 'Handicap'
	| 'AutresBesoins26ans';

export interface FormulairesProps {
	setTypeFormulaireAffiché: Dispatch<SetStateAction<Formulaires>>;
	setIsFranceTravailModalOpen: Dispatch<SetStateAction<boolean>>;
	setIsInscriptionFranceTravailModalOpen: Dispatch<SetStateAction<boolean>>;
	setIsMissionLocaleModalOpen: Dispatch<SetStateAction<boolean>>;
	setIsDispositifsReferencesModalOpen: Dispatch<SetStateAction<boolean>>;
	onBackButton: () => void
}


export default function Accompagnement() {
	const [typeFormulaireAffiché, setTypeFormulaireAffiché] = useState<Formulaires>('Démarrage');
	const [isFranceTravailModalOpen, setIsFranceTravailModalOpen] = useState(false);
	const [isInscriptionFranceTravailModalOpen, setIsInscriptionFranceTravailModalOpen] = useState(false);
	const [isMissionLocaleModalOpen, setIsMissionLocaleModalOpen] = useState(false);
	const [isDispositifsReferencesModalOpen, setIsDispositifsReferencesModalOpen] = useState(false);
	const lienFranceTravail = 'https://authentification-candidat.francetravail.fr/connexion/XUI/?realm=%2Findividu&goto=https%3A%2F%2Fauthentification-candidat.francetravail.fr%2Fconnexion%2Foauth2%2Frealms%2Froot%2Frealms%2Findividu%2Fauthorize%3Frealm%3D%252Findividu%26response_type%3Did_token%2520token%26scope%3Dopenid%2520compteUsager%2520profile%2520contexteAuthentification%2520email%2520courrier%2520notifications%2520etatcivil%2520logW%2520individu%2520pilote%2520nomenclature%2520coordonnees%2520navigation%2520reclamation%2520prdvl%2520idIdentiteExterne%2520francetravail%2520suggestions%2520actu%2520application_USG_PN073-tdbcandidat_6408B42F17FC872440D4FF01BA6BAB16999CD903772C528808D1E6FA2B585CF2%26client_id%3DUSG_PN073-tdbcandidat_6408B42F17FC872440D4FF01BA6BAB16999CD903772C528808D1E6FA2B585CF2%26state%3DOZ3c4XQiDGwEdFxx%26nonce%3DF54AlR39GLoLCIpT%26redirect_uri%3Dhttps%253A%252F%252Fcandidat.francetravail.fr%252Fespacepersonnel%252F#login/';
	const deuxièmeLienFranceTravail = 'https://candidat.francetravail.fr/inscription-en-ligne/accueil';
	const formulaire = getFormulaireÀAfficher(typeFormulaireAffiché, setTypeFormulaireAffiché, setIsFranceTravailModalOpen, setIsInscriptionFranceTravailModalOpen, setIsMissionLocaleModalOpen, setIsDispositifsReferencesModalOpen);

	return (
		<>
			<section className={styles.accompagnement}>
				<div className={styles.accompagnementContainer}>
					<div>
						<h2 id="accompagnement">Contrat d‘Engagement Jeune, je me lance !</h2>
						<div className={styles.accompagnementExplication}>
							Pour entrer en Contrat d‘Engagement Jeune, vous devez vous rapprocher d‘un professionnel de
							l‘accompagnement chez France Travail ou en Mission Locale. Pour vous aider à
							identifier l‘interlocuteur à contacter, répondez à ces quelques questions.
						</div>
					</div>
					<article>
						{formulaire}
					</article>
				</div>
			</section>

			<ModaleFranceTravail
				open={isFranceTravailModalOpen}
				close={() => setIsFranceTravailModalOpen(false)}
				href={lienFranceTravail} />

			<ModaleInscriptionFranceTravail
				open={isInscriptionFranceTravailModalOpen}
				close={() => setIsInscriptionFranceTravailModalOpen(false)}
				href={deuxièmeLienFranceTravail} />

			<ModaleMissionLocale
				isMissionLocaleModaleOpen={isMissionLocaleModalOpen}
				setIsMissionLocaleModaleOpen={setIsMissionLocaleModalOpen} />

			<ModaleDispositifsReferences
				open={isDispositifsReferencesModalOpen}
				close={() => setIsDispositifsReferencesModalOpen(false)} />
		</>
	);
}

function getFormulaireÀAfficher(typeFormulaireÀAfficher: Formulaires, setTypeFormulaireAffiché: Dispatch<SetStateAction<Formulaires>>, setIsFranceTravailModalOpen: Dispatch<SetStateAction<boolean>>, setIsInscriptionFranceTravailModalOpen: Dispatch<SetStateAction<boolean>>, setIsMissionLocaleModalOpen: Dispatch<SetStateAction<boolean>>, setIsDispositifsReferencesModalOpen: Dispatch<SetStateAction<boolean>>) {
	switch (typeFormulaireÀAfficher) {
		case 'PasDAccompagnement':
			return (
				<PasDAccompagnement
					onBackButton={() => setTypeFormulaireAffiché('Démarrage')}
					setTypeFormulaireAffiché={setTypeFormulaireAffiché}
					setIsMissionLocaleModalOpen={setIsMissionLocaleModalOpen} />
			);
		case 'BesoinAide':
			return (
				<BesoinAide
					onBackButton={() => setTypeFormulaireAffiché('PasDAccompagnement')}
					setTypeFormulaireAffiché={setTypeFormulaireAffiché}
					setIsDispositifsReferencesModalOpen={setIsDispositifsReferencesModalOpen} />
			);
		case 'BesoinAide26ans':
			return (
				<BesoinAide26ans
					onBackButton={() => setTypeFormulaireAffiché('PasDAccompagnement')}
					setTypeFormulaireAffiché={setTypeFormulaireAffiché}
					setIsDispositifsReferencesModalOpen={setIsDispositifsReferencesModalOpen} />
			);
		case 'AutresBesoins':
			return (
				<AutresBesoins
					onBackButton={() => setTypeFormulaireAffiché('BesoinAide')}
					setIsInscriptionFranceTravailModalOpen={setIsInscriptionFranceTravailModalOpen}
					setIsMissionLocaleModalOpen={setIsMissionLocaleModalOpen} />
			);
		case 'Handicap':
			return (
				<Handicap
					onBackButton={() => setTypeFormulaireAffiché('BesoinAide26ans')}
					setTypeFormulaireAffiché={setTypeFormulaireAffiché}
					setIsInscriptionFranceTravailModalOpen={setIsInscriptionFranceTravailModalOpen} />
			);
		case 'AutresBesoins26ans':
			return (
				<AutresBesoins
					onBackButton={() => setTypeFormulaireAffiché('Handicap')}
					setIsInscriptionFranceTravailModalOpen={setIsInscriptionFranceTravailModalOpen}
					setIsMissionLocaleModalOpen={setIsMissionLocaleModalOpen} />
			);
		default:
			return (
				<Démarrage
					setTypeFormulaireAffiché={setTypeFormulaireAffiché}
					setIsFranceTravailModalOpen={setIsFranceTravailModalOpen}
					setIsMissionLocaleModalOpen={setIsMissionLocaleModalOpen} />
			);
	}
}
