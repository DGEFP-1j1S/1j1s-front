import { useRouter } from 'next/router';
import { FormEvent, useEffect, useRef, useState } from 'react';

import { InputDateDeDebut } from '~/client/components/features/OffreDeStage/Déposer/Étape2Stage/InputDateDeDebut';
import { RadioIsDatePrecise } from '~/client/components/features/OffreDeStage/Déposer/Étape2Stage/RadioIsDatePrecise';
import {
	StageDeposerOffreFormulaireLayout,
} from '~/client/components/features/OffreDeStage/Déposer/FormulaireLayout/StageDeposerOffreFormulaireLayout';
import { OffreDeStageDeposeeStage } from '~/client/components/features/OffreDeStage/Déposer/StageDeposerOffre';
import { domaineStage } from '~/client/components/features/OffreDeStage/Déposer/StageDomaines';
import { FormulaireÉtapeLayout } from '~/client/components/layouts/FormulaireEtape/FormulaireEtapeLayout';
import { ButtonComponent } from '~/client/components/ui/Button/ButtonComponent';
import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { Input } from '~/client/components/ui/Form/Input';
import { InputWithUnit } from '~/client/components/ui/Form/InputWithUnit/InputWithUnit';
import { SelectSimple } from '~/client/components/ui/Form/Select/SelectSimple';
import { TextArea } from '~/client/components/ui/Form/TextArea/TextArea';
import { Icon } from '~/client/components/ui/Icon/Icon';
import { Radio } from '~/client/components/ui/Radio/Radio';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import {
	StageDeposerOffreEtape1PersistenceService,
} from '~/client/services/stageDeposerOffreEtape1Persistence/stageDeposerOffreEtape1Persistence.service';
import {
	StageDeposerOffreEtape2PersistenceService,
} from '~/client/services/stageDeposerOffreEtape2Persistence/stageDeposerOffreEtape2Persistence.service';
import { URL_DEPOSER_OFFRE } from '~/pages/stages/deposer-offre/index.page';
import { DomainesStage } from '~/server/stages/repository/domainesStage';
import { emailRegex } from '~/shared/emailRegex';
import { urlRegex } from '~/shared/urlRegex';

import styles from './StageDeposerOffreFormulaireÉtape2Stage.module.scss';

const EMAIL_OR_URL_REGEX = `${emailRegex}|${urlRegex}`;
const DUREE_MOIS_EN_JOUR = 30;
const LONGUEUR_MAX_TITRE = 200;

export enum StageEnum {
	DATE_DE_DEBUT_MIN = 'dateDeDebutMin',
	DATE_DE_DEBUT_MAX = 'dateDeDebutMax',
	IS_DATE_DE_DEBUT_PRECISE = 'isDateDeDebutPrecise',
	NOM = 'nomOffre',
	LIEN_CANDIDATURE = 'lienCandidature',
	DESCRIPTION = 'descriptionOffre',
	DUREE = 'dureeStage',
	DOMAINE = 'domaineStage',
	REMUNERATION = 'remunerationStage',
	TELETRAVAIL = 'teletravail',
}

export enum Teletravail {
	OUI = 'true',
	NON = 'false',
}

export enum IsDateDeDebutPrecise {
	OUI = 'true',
	NON = 'false',
}

const dureeStageList = [
	{ libellé: '1 mois', valeur: DUREE_MOIS_EN_JOUR.toString() },
	{ libellé: '2 mois', valeur: (2 * DUREE_MOIS_EN_JOUR).toString() },
	{ libellé: '3 mois', valeur: (3 * DUREE_MOIS_EN_JOUR).toString() },
	{ libellé: '4 mois', valeur: (4 * DUREE_MOIS_EN_JOUR).toString() },
	{ libellé: '5 mois', valeur: (5 * DUREE_MOIS_EN_JOUR).toString() },
	{ libellé: '6 mois', valeur: (6 * DUREE_MOIS_EN_JOUR).toString() },
];

function ChampsObligatoires(props: { informationsStage: OffreDeStageDeposeeStage | null }) {
	const [displayDateDeDebutPrecise, setDisplayDateDeDebutPrecise] = useState<boolean>(props.informationsStage?.isDateDeDebutPrecise ? props.informationsStage.isDateDeDebutPrecise === IsDateDeDebutPrecise.OUI : true);

	return (
		<>
			<Champ className={styles.inputNomOffre}>
				<Champ.Label>Nom de l’offre de stage (200 caractères maximum)
					<Champ.Label.Complement>Exemple : Assistant de recherche (6mois) chez ABC.ENTREPRISE</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input
					render={Input}
					name={StageEnum.NOM}
					defaultValue={props.informationsStage?.nomOffre}
					maxLength={LONGUEUR_MAX_TITRE}
					required />
				<Champ.Error />
			</Champ>
			<Champ className={styles.inputLienCandidature}>
				<Champ.Label>Lien sur lequel les candidats pourront postuler ou une adresse e-mail à laquelle envoyer sa
				candidature
				<Champ.Label.Complement>Exemples : https://candidat.francetravail.fr/offres/142Y OU
					candidature_PE_technicien@exemple.com</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input
					render={Input}
					pattern={EMAIL_OR_URL_REGEX}
					name={StageEnum.LIEN_CANDIDATURE}
					defaultValue={props.informationsStage?.lienCandidature}
					required />
				<Champ.Error />
			</Champ>

			<Champ className={styles.textareaWrapper}>
				<Champ.Label>Description de l’offre de stage (200 caractères minimum)
					<Champ.Label.Complement>Informations sur le stage : les objectifs, les challenges, les
					missions…</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input
					render={TextArea}
					name={StageEnum.DESCRIPTION}
					defaultValue={props.informationsStage?.descriptionOffre}
					required
					rows={10}
					minLength={200} />
				<Champ.Error />
			</Champ>
			<fieldset className={styles.contenuDateDeDebut}>
				<legend>Date de début du stage</legend>
				<RadioIsDatePrecise
					checked={displayDateDeDebutPrecise}
					onChange={() => setDisplayDateDeDebutPrecise(!displayDateDeDebutPrecise)} />
				<InputDateDeDebut
					displayDateDeDebutPrecise={displayDateDeDebutPrecise}
					informationsStage={props.informationsStage} />
			</fieldset>

			<Champ>
				<Champ.Label>
				Durée du stage
					<Champ.Label.Complement>Exemple : 3 mois</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input
					className={styles.dureeStage}
					render={SelectSimple}
					required
					optionsAriaLabel={'Durée'}
					name={StageEnum.DUREE}
					defaultValue={props.informationsStage?.dureeStage}>
					{dureeStageList.map((option) =>
						<SelectSimple.Option key={option.libellé} value={option.valeur}>{option.libellé}</SelectSimple.Option>,
					)}
				</Champ.Input>
				<Champ.Error />
			</Champ>
		</>
	);
}

function ChampsFaculatifs(props: { informationsStage: OffreDeStageDeposeeStage | null }) {
	return (
		<>
			<Champ>
				<Champ.Label>
				Domaine de l’offre de stage
					<Champ.Label.Complement>Exemple : Agriculture</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input
					render={SelectSimple}
					optionsAriaLabel={'Domaine'}
					name={StageEnum.DOMAINE}
					defaultValue={props.informationsStage?.domaineStage}>
					{domaineStage.map((option) =>
						<SelectSimple.Option key={option.libellé} value={option.valeur}>{option.libellé}</SelectSimple.Option>,
					)}
				</Champ.Input>
				<Champ.Error />
			</Champ>

			<Champ>
				<Champ.Label>
				Rémunération par mois
					<Champ.Label.Complement>Exemple : 560</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input
					render={InputWithUnit}
					nomDeLUnite={'Euro'}
					unite={'€'}
					type="number"
					name={StageEnum.REMUNERATION}
					min={0}
					defaultValue={props.informationsStage?.remunerationStage} />
				<Champ.Error />
			</Champ>

			<div>
				<fieldset className={styles.contenuTeletravail}>
					<legend>Télétravail possible</legend>
					<div className={styles.inputTeletravail}>
						<Radio name={StageEnum.TELETRAVAIL}
							value="true"
							label="Oui"
								 defaultChecked={props.informationsStage?.teletravail === Teletravail.OUI} />
						<Radio name={StageEnum.TELETRAVAIL}
							value="false"
							label="Non"
								 defaultChecked={props.informationsStage?.teletravail === Teletravail.NON} />
					</div>
				</fieldset>
			</div>
		</>
	);
}

export default function StageDeposerOffreFormulaireÉtape2Stage() {
	const router = useRouter();
	const formRef = useRef<HTMLFormElement>(null);

	const persistenceEntreprise = useDependency<StageDeposerOffreEtape1PersistenceService>('stageDeposerOffreEtape1PersistenceService');
	const informationsEntreprise = persistenceEntreprise.getInformationsEtape1();

	const persistenceStage = useDependency<StageDeposerOffreEtape2PersistenceService>('stageDeposerOffreEtape2PersistenceService');
	const informationsStage = persistenceStage.getInformationsEtape2();

	useEffect(() => {
		if (!informationsEntreprise) {
			router.push(URL_DEPOSER_OFFRE);
		}
	}, [router, informationsEntreprise]);

	function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form: HTMLFormElement = event.currentTarget;
		const data = new FormData(form);
		const donnéesOffreDeStage = parseDonneesOffreDeStage(data);
		persistenceStage.setInformationsEtape2(donnéesOffreDeStage);
		return router.push(`${URL_DEPOSER_OFFRE}/localisation`);
	}

	return (
		<FormulaireÉtapeLayout
			étape="Étape 2 sur 3 : Votre offre de stage"
			urlÉtapePrécédente={URL_DEPOSER_OFFRE}>
			<StageDeposerOffreFormulaireLayout
				inputsObligatoires={
					<ChampsObligatoires informationsStage={informationsStage} />
				}
				inputsFacultatifs={<ChampsFaculatifs informationsStage={informationsStage} />}
				formRef={formRef}
				handleFormSubmit={handleFormSubmit}
				boutonValidation={(
					<ButtonComponent
						icon={<Icon name="angle-right" />}
						iconPosition="right"
						label="Suivant"
						type="submit" />
				)} />
		</FormulaireÉtapeLayout>
	);
};

function isDateDeDebutPrecise(formData: FormData): boolean {
	return formData.get(StageEnum.IS_DATE_DE_DEBUT_PRECISE) === IsDateDeDebutPrecise.OUI;
}

function parseDonneesOffreDeStage(formData: FormData): OffreDeStageDeposeeStage {
	return {
		dateDeDebutMax: !isDateDeDebutPrecise(formData) ? String(formData.get(StageEnum.DATE_DE_DEBUT_MAX)) : String(formData.get(StageEnum.DATE_DE_DEBUT_MIN)),
		dateDeDebutMin: String(formData.get(StageEnum.DATE_DE_DEBUT_MIN)),
		descriptionOffre: String(formData.get(StageEnum.DESCRIPTION)),
		domaineStage: formData.get(StageEnum.DOMAINE) as DomainesStage,
		dureeStage: String(formData.get(StageEnum.DUREE)),
		isDateDeDebutPrecise: formData.get(StageEnum.IS_DATE_DE_DEBUT_PRECISE) as IsDateDeDebutPrecise,
		lienCandidature: String(formData.get(StageEnum.LIEN_CANDIDATURE)),
		nomOffre: String(formData.get(StageEnum.NOM)),
		remunerationStage: String(formData.get(StageEnum.REMUNERATION)),
		teletravail: formData.get(StageEnum.TELETRAVAIL) as Teletravail,
	};
}
