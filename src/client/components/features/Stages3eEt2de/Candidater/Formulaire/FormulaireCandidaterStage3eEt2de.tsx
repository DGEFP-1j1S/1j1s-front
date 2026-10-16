import React, { FormEvent, useState } from 'react';

import { BackButton } from '~/client/components/features/ButtonRetour/BackButton';
import { Container } from '~/client/components/layouts/Container/Container';
import { ButtonComponent } from '~/client/components/ui/Button/ButtonComponent';
import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { Input } from '~/client/components/ui/Form/Input';
import { SelectSimple } from '~/client/components/ui/Form/Select/SelectSimple';
import { TextArea } from '~/client/components/ui/Form/TextArea/TextArea';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import { Stage3eEt2deService } from '~/client/services/stage3eEt2de/stage3eEt2de.service';
import { isFailure, isSuccess } from '~/server/errors/either';
import { Erreur } from '~/server/errors/erreur.types';
import { CandidatureStage3eEt2de, ModeDeContact } from '~/server/stage-3e-et-2de/domain/candidatureStage3eEt2de';
import { MetierStage3eEt2de } from '~/server/stage-3e-et-2de/domain/metierStage3eEt2de';
import { emailRegex } from '~/shared/emailRegex';
import { telFrRegex } from '~/shared/telRegex';

import styles from './FormulaireCandidaterStage3eEt2de.module.scss';

const INSTRUCTION_CANDIDATURE_TELEPHONE = (
	<>
		<p className={styles.sousTitre}>Cette entreprise souhaite être contactée par téléphone. Merci de nous indiquer
		vos coordonnées.</p>
		<p className={styles.sousTitre}>Nous allons vous transmettre par e-mail le nom de la personne à contacter, son
		numéro de téléphone ainsi que des
		conseils pour présenter votre demande d’immersion. Ces informations sont personnelles et confidentielles.
		Elles ne peuvent pas être communiquées à d’autres personnes.
		</p>
	</>
);

const INSTRUCTION_CANDIDATURE_EN_PERSONNE = (
	<>
		<p className={styles.sousTitre}>Cette entreprise souhaite que vous vous présentiez directement pour candidater.
		Merci de nous indiquer vos coordonnées.</p>
		<p className={styles.sousTitre}>Vous recevrez par e-mail le nom de la personne à contacter ainsi que des
		conseils pour présenter votre demande d’immersion. Ces informations sont personnelles et confidentielles.
		Elles ne peuvent pas être communiquées à d’autres personnes.
		</p>
	</>
);

const DECHARGE = (
	<div className={styles.decharge}>
		<p>
		Vous êtes informé que vos données à caractère personnel sont collectées et traitées par la DGEFP pour
		répondre à votre demande. Pour en savoir plus vous pouvez consulter la politique de confidentialité et les
		CGU de la DGEFP. En cliquant sur &quot;Envoyer mes informations&quot;, vos données seront transmises à la
		mission
		locale de la zone géographique dans laquelle vous résidez pour que celle-ci prenne contact avec vous
		</p>
	</div>
);

const INSTRUCTION_CANDIDATURE_MAIL = (
	<p className={styles.sousTitre}>Cette entreprise a choisi d’être contactée par
	e-mail. Veuillez compléter ce formulaire qui sera transmis à l’entreprise.</p>
);

const messageContactParDefaut =
	`Bonjour,
 
J’ai trouvé votre entreprise sur le site https://www.1jeune1solution.gouv.fr/
[Rédigez ici votre email de motivation.]

Pourriez-vous me contacter par mail ou par téléphone pour me proposer un rendez-vous ?

En vous remerciant,
`;

export function FormulaireCandidaterStage3eEt2de(props: {
	modeDeContact: ModeDeContact,
	nomEntreprise: string,
	siret: string,
	metiersStage3eEt2de: Array<MetierStage3eEt2de>,
	onSuccess: () => void,
	onFailure: (erreur: Erreur) => void,
}) {
	const {
		modeDeContact,
		nomEntreprise,
		metiersStage3eEt2de,
		siret,
		onSuccess,
		onFailure,
	} = props;

	const stage3eEt2deService = useDependency<Stage3eEt2deService>('stage3eEt2deService');

	const [isLoading, setIsLoading] = useState(false);

	const isMoreThanOneMetier = metiersStage3eEt2de.length > 1;

	async function envoyerCandidature(event: FormEvent<HTMLFormElement>) {
		setIsLoading(true);
		event?.preventDefault();
		const form: HTMLFormElement = event.currentTarget;
		const data = new FormData(form);
		let candidature: CandidatureStage3eEt2de;

		if (modeDeContact === ModeDeContact.IN_PERSON || modeDeContact === ModeDeContact.PHONE) {
			candidature = {
				// NOTE (SULI 25-01-2024): Deux façon de récupérer appellationCode car pour la présence d'un seul métier, on utilise le composant Select et il fournit seulement le label et pas le code
				appellationCode: isMoreThanOneMetier ? String(data.get('metierCode')) : metiersStage3eEt2de[0].code,
				email: String(data.get('email')),
				modeDeContact: modeDeContact,
				nom: String(data.get('nom')),
				prenom: String(data.get('prenom')),
				siret: siret,
			};
		} else {
			candidature = {
				appellationCode: isMoreThanOneMetier ? String(data.get('metierCode')) : metiersStage3eEt2de[0].code,
				email: String(data.get('email')),
				message: String(data.get('message')),
				modeDeContact: modeDeContact,
				nom: String(data.get('nom')),
				objectif: 'Découvrir un métier ou un secteur d\'activité',
				prenom: String(data.get('prenom')),
				siret: siret,
				telephone: String(data.get('telephone')),
			};
		}
		const resultat = await stage3eEt2deService.candidaterStage3eEt2de(candidature);
		setIsLoading(false);
		if (isSuccess(resultat)) onSuccess();
		if (isFailure(resultat)) onFailure(resultat.errorType);
	}

	return (
		<>
			<div className={styles.header}>
				<div className={styles.headerTextContainer}>
					<h1 className={styles.titre}>Je candidate à l’offre de stage de 3e ou de 2de de
					l’entreprise <em>{nomEntreprise}</em></h1>
					{modeDeContact === ModeDeContact.PHONE && INSTRUCTION_CANDIDATURE_TELEPHONE}
					{modeDeContact === ModeDeContact.IN_PERSON && INSTRUCTION_CANDIDATURE_EN_PERSONNE}
					{modeDeContact === ModeDeContact.EMAIL && INSTRUCTION_CANDIDATURE_MAIL}
				</div>
			</div>

			{modeDeContact === ModeDeContact.PHONE && (
				<FormulaireContactParTelephone
					nomEntreprise={nomEntreprise}
					envoyerCandidature={envoyerCandidature}
					metiersStage3eEt2de={metiersStage3eEt2de}
					isLoading={isLoading} />
			)}
			{modeDeContact === ModeDeContact.IN_PERSON && (
				<FormulaireContactEnPersonne
					nomEntreprise={nomEntreprise}
					envoyerCandidature={envoyerCandidature}
					metiersStage3eEt2de={metiersStage3eEt2de}
					isLoading={isLoading} />
			)}
			{modeDeContact === ModeDeContact.EMAIL && (
				<FormulaireContactParEmail
					nomEntreprise={nomEntreprise}
					envoyerCandidature={envoyerCandidature}
					metiersStage3eEt2de={metiersStage3eEt2de}
					isLoading={isLoading} />
			)}
		</>
	);
}

const FormulaireContactEnPersonne = FormulaireContactParTelephone;

function FormulaireContactParTelephone(props: {
	nomEntreprise: string,
	envoyerCandidature: (event: FormEvent<HTMLFormElement>) => void
	isLoading: boolean,
	metiersStage3eEt2de: Array<MetierStage3eEt2de>
}) {
	const isMoreThanOneMetier = props.metiersStage3eEt2de.length > 1;

	return (
		<>
			<Container className={styles.formulaireContainer}>

				<BackButton label="Retour à la recherche" aria-label="Retour à la recherche" className={styles.boutonRetour} />

				<p className={styles.mentionChampsObligatoires}>Tous les champs sont obligatoires (sauf mention contraire)</p>

				<form
					aria-label={`Candidater à l’offre de stage de 3e et 2de de l’entreprise ${props.nomEntreprise}`}
					onSubmit={props.envoyerCandidature}
					className={styles.formulaireEtapeUnique}>
					<Champ>
						<Champ.Label>Prénom
							<Champ.Label.Complement>Exemple : Alexis</Champ.Label.Complement>
						</Champ.Label>
						<Champ.Input render={Input}
											 name="prenom"
											 required
											 type="text"
											 autoComplete="given-name" />
						<Champ.Error />
					</Champ>
					<Champ>
						<Champ.Label>Nom
							<Champ.Label.Complement>Exemple : Dupont</Champ.Label.Complement>
						</Champ.Label>
						<Champ.Input render={Input}
											 name="nom"
											 required
											 type="text"
											 autoComplete="family-name" />
						<Champ.Error />
					</Champ>
					<Champ>
						<Champ.Label>E-mail
							<Champ.Label.Complement>Exemple : alexis.dupont@example.com</Champ.Label.Complement>
						</Champ.Label>
						<Champ.Input render={Input}
											 name="email"
											 required
											 type="email"
											 autoComplete="email"
											 pattern={emailRegex} />
						<Champ.Error />
					</Champ>
					{ /* FIXME (DORO 22-01-2024: Ajouter la gestion de readonly dans Select */}
					{isMoreThanOneMetier ? (
						<Champ>
							<Champ.Label>
							Métier sur lequel porte la demande d’immersion
								<Champ.Label.Complement>Un ou plusieurs métiers ont été renseignés par l’entreprise</Champ.Label.Complement>
							</Champ.Label>
							<Champ.Input
								render={SelectSimple}
								required
								optionsAriaLabel={'metiers'}
								name={'metierCode'}>
								{props.metiersStage3eEt2de.map((metier) =>
									<SelectSimple.Option key={metier.label} value={metier.code}>{metier.label}</SelectSimple.Option>,
								)}
							</Champ.Input>
							<Champ.Error />
						</Champ>
					) : (
						<Champ>
							<Champ.Label>
							Métier sur lequel porte la demande d’immersion
								<Champ.Label.Complement className={styles.elementDesactive}>Un ou plusieurs métiers ont été renseignés par
								l’entreprise</Champ.Label.Complement>
							</Champ.Label>
							<Champ.Input render={Input}
												 name="metierCode"
												 required
												 value={props.metiersStage3eEt2de[0].label}
												 readOnly
												 type="text" />
							<Champ.Error />
						</Champ>
					)}
					<ButtonComponent
						className={styles.boutonSoumission}
						label="Envoyer les informations"
						type="submit"
						disabled={props.isLoading} />
				</form>
			</Container>
			{DECHARGE}
		</>
	);
}

function FormulaireContactParEmail(props: {
	nomEntreprise: string,
	envoyerCandidature: (event: FormEvent<HTMLFormElement>) => void
	isLoading: boolean,
	metiersStage3eEt2de: Array<MetierStage3eEt2de>
}) {
	const isMoreThanOneMetier = props.metiersStage3eEt2de.length > 1;

	return (
		<>
			<Container className={styles.formulaireContainer}>

				<BackButton label="Retour à la recherche" aria-label="Retour à la recherche" className={styles.boutonRetour} />

				<p className={styles.mentionChampsObligatoires}>Tous les champs sont obligatoires (sauf mention contraire)</p>

				<form
					aria-label={`Candidater à l’offre de stage de 3e et 2de de l’entreprise ${props.nomEntreprise}`}
					onSubmit={props.envoyerCandidature}
					className={styles.formulaireEtapeUnique}>
					<Champ>
						<Champ.Label>Prénom
							<Champ.Label.Complement>Exemple : Alexis</Champ.Label.Complement>
						</Champ.Label>
						<Champ.Input render={Input}
											 name="prenom"
											 required
											 type="text"
											 autoComplete="given-name" />
						<Champ.Error />
					</Champ>
					<Champ>
						<Champ.Label>Nom
							<Champ.Label.Complement>Exemple : Dupont</Champ.Label.Complement>
						</Champ.Label>
						<Champ.Input render={Input}
											 name="nom"
											 required
											 type="text"
											 autoComplete="family-name" />
						<Champ.Error />
					</Champ>
					<Champ>
						<Champ.Label>E-mail
							<Champ.Label.Complement>Exemple : alexis.dupont@example.com</Champ.Label.Complement>
						</Champ.Label>
						<Champ.Input render={Input}
											 name="email"
											 required
											 type="email"
											 autoComplete="email"
											 pattern={emailRegex} />
						<Champ.Error />
					</Champ>
					<Champ>
						<Champ.Label>
						Téléphone
							<Champ.Label.Complement>
							Exemples : 0601020304 ou +33601020304
							</Champ.Label.Complement>
						</Champ.Label>
						<Champ.Input render={Input}
											 name="telephone"
											 required
											 type="tel"
											 autoComplete="tel"
											 pattern={telFrRegex} />
						<Champ.Error />
					</Champ>
					{ /* FIXME (DORO 22-01-2024: Ajouter la gestion de readonly dans Select */}
					{isMoreThanOneMetier ? (
						<Champ>
							<Champ.Label>
							Métier sur lequel porte la demande d’immersion
								<Champ.Label.Complement>Un ou plusieurs métiers ont été renseignés par l’entreprise</Champ.Label.Complement>
							</Champ.Label>
							<Champ.Input
								render={SelectSimple}
								required
								optionsAriaLabel={'metiers'}
								name={'metierCode'}>
								{props.metiersStage3eEt2de.map((metier) =>
									<SelectSimple.Option key={metier.label} value={metier.code}>{metier.label}</SelectSimple.Option>,
								)}
							</Champ.Input>
							<Champ.Error />
						</Champ>
					) : (
						<Champ>
							<Champ.Label>
							Métier sur lequel porte la demande d’immersion
								<Champ.Label.Complement className={styles.elementDesactive}>Un ou plusieurs métiers ont été renseignés par
								l’entreprise</Champ.Label.Complement>
							</Champ.Label>
							<Champ.Input render={Input}
												 name="metierCode"
												 required
												 value={props.metiersStage3eEt2de[0].label}
												 readOnly
												 type="text" />
							<Champ.Error />
						</Champ>
					)}
					<Champ className={styles.champMessage}>
						<Champ.Label>
						Votre message à l’entreprise
							<Champ.Label.Complement>
							Partagez vos motivations, vos attentes ou toute information que vous jugeriez utiles (500 charactères
							maximum)
							</Champ.Label.Complement>
						</Champ.Label>
						<Champ.Input
							render={TextArea}
							name="message"
							maxLength={500}
							required
							defaultValue={messageContactParDefaut} />
						<Champ.Error />
					</Champ>
					<ButtonComponent
						className={styles.boutonSoumission}
						label="Envoyer les informations"
						type="submit"
						disabled={props.isLoading} />
				</form>
			</Container>
			{DECHARGE}
		</>
	);
}
