import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { Finalite, ServiceConsentement } from '~/client/services/cookies/cookies.service';

import { Button } from '../Button';

declare global {
	interface Window {
		dsfr?: ((element: Element) => { modal?: { disclose: () => void, conceal: () => void } }) & { start: () => void }
	}
}

export const PANNEAU_CONSENTEMENT_ID = 'fr-consent-modal';
const TITRE_ID = 'fr-consent-modal-title';

type Choix = Record<string, boolean | undefined>;

type PanneauConsentementProps = {
	estOuvert: boolean
	finalites: Array<Finalite> | null
	onFermer: () => void
	onConfirmer: (choix: Record<string, boolean>) => void
};

export function PanneauConsentement({ estOuvert, finalites, onFermer, onConfirmer }: PanneauConsentementProps) {
	const modalRef = useRef<HTMLDialogElement>(null);
	const [finalitesAffichees, setFinalitesAffichees] = useState<Array<Finalite>>([]);
	const [choix, setChoix] = useState<Choix>({});

	// garde le contenu affiché pendant l'animation de fermeture
	if (finalites && finalites !== finalitesAffichees) {
		setFinalitesAffichees(finalites);
		setChoix(choixInitiaux(finalites));
	}

	useEffect(function synchroniserModaleDsfr() {
		const modale = modalRef.current && window.dsfr?.(modalRef.current).modal;
		if (estOuvert) {
			modale?.disclose();
		} else {
			modale?.conceal();
		}
	}, [estOuvert]);

	useEffect(function ecouterFermetureDsfr() {
		const modale = modalRef.current;
		modale?.addEventListener('dsfr.conceal', onFermer);
		return () => modale?.removeEventListener('dsfr.conceal', onFermer);
	}, [onFermer]);

	const services = finalitesAffichees.flatMap((finalite) => finalite.services);
	const toutAccepte = services.length > 0 && services.every((service) => choix[service.id] === true);
	const toutRefuse = services.length > 0 && services.every((service) => choix[service.id] === false);

	function choisir(servicesChoisis: Array<ServiceConsentement>, autorise: boolean) {
		setChoix((choixPrecedents) => ({
			...choixPrecedents,
			...Object.fromEntries(servicesChoisis.map((service) => [service.id, autorise])),
		}));
	}

	function confirmer() {
		const choixFaits = Object.entries(choix)
			.filter((entree): entree is [string, boolean] => entree[1] !== undefined);
		onConfirmer(Object.fromEntries(choixFaits));
	}

	return (
		<dialog ref={modalRef} id={PANNEAU_CONSENTEMENT_ID} className="fr-modal" aria-labelledby={TITRE_ID}>
			<div className="fr-container fr-container--fluid fr-container-md">
				<div className="fr-grid-row fr-grid-row--center">
					<div className="fr-col-12 fr-col-md-10 fr-col-lg-8">
						<div className="fr-modal__body">
							<div className="fr-modal__header">
								<button type="button" className="fr-btn--close fr-btn" aria-controls={PANNEAU_CONSENTEMENT_ID} title="Fermer">
									Fermer
								</button>
							</div>
							<div className="fr-modal__content">
								<h2 id={TITRE_ID} className="fr-modal__title">Panneau de gestion des cookies</h2>
								<div className="fr-consent-manager">
									<div className="fr-consent-service fr-consent-manager__header">
										<fieldset className="fr-fieldset">
											<legend className="fr-consent-service__title">
												Préférences pour tous les services. <Link href="/confidentialite" prefetch={false}>Politique de confidentialité</Link>
											</legend>
											<div className="fr-consent-service__radios">
												<RadioConsentement
													id="consentement-tout-accepter"
													name="consentement-tout"
													label="Tout accepter"
													checked={toutAccepte}
													onChange={() => choisir(services, true)} />
												<RadioConsentement
													id="consentement-tout-refuser"
													name="consentement-tout"
													label="Tout refuser"
													checked={toutRefuse}
													onChange={() => choisir(services, false)} />
											</div>
										</fieldset>
									</div>
									{finalitesAffichees.map((finalite) => (
										<FinaliteConsentement key={finalite.id} finalite={finalite} choix={choix} onChoisir={choisir} />
									))}
									<ul className="fr-consent-manager__buttons fr-btns-group fr-btns-group--right fr-btns-group--inline-sm">
										<li>
											<Button type="button" label="Confirmer mes choix" onClick={confirmer} />
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</dialog>
	);
}

function choixInitiaux(finalites: Array<Finalite>): Choix {
	return Object.fromEntries(finalites
		.flatMap((finalite) => finalite.services)
		.map((service) => [service.id, service.autorise]));
}

type FinaliteConsentementProps = {
	finalite: Finalite
	choix: Choix
	onChoisir: (services: Array<ServiceConsentement>, autorise: boolean) => void
};

function FinaliteConsentement({ finalite, choix, onChoisir }: FinaliteConsentementProps) {
	const [sontDetailsOuverts, setSontDetailsOuverts] = useState(false);
	const idLegende = `finalite-${finalite.id}-legende`;
	const idDescription = `finalite-${finalite.id}-description`;
	const idDetails = `finalite-${finalite.id}-details`;
	const { services } = finalite;
	const estAcceptee = finalite.obligatoire || (services.length > 0 && services.every((service) => choix[service.id] === true));
	const estRefusee = !finalite.obligatoire && services.length > 0 && services.every((service) => choix[service.id] === false);

	return (
		<div className="fr-consent-service">
			<fieldset
				className="fr-fieldset"
				role="group"
				aria-labelledby={finalite.description ? `${idLegende} ${idDescription}` : idLegende}>
				<legend id={idLegende} className="fr-consent-service__title">{finalite.titre}</legend>
				<div className="fr-consent-service__radios">
					<RadioConsentement
						id={`consentement-${finalite.id}-accepter`}
						name={`consentement-${finalite.id}`}
						label="Accepter"
						checked={estAcceptee}
						onChange={() => onChoisir(services, true)} />
					<RadioConsentement
						id={`consentement-${finalite.id}-refuser`}
						name={`consentement-${finalite.id}`}
						label="Refuser"
						checked={estRefusee}
						disabled={finalite.obligatoire}
						onChange={() => onChoisir(services, false)} />
				</div>
				{finalite.description && (
					<div id={idDescription} className="fr-consent-service__desc" dangerouslySetInnerHTML={{ __html: finalite.description }} />
				)}
				{services.length > 0 && (
					<>
						<div className="fr-consent-service__collapse">
							<button
								type="button"
								className="fr-consent-service__collapse-btn"
								aria-expanded={sontDetailsOuverts}
								aria-describedby={idLegende}
								aria-controls={idDetails}
								onClick={() => setSontDetailsOuverts(!sontDetailsOuverts)}>
								Voir plus de détails
							</button>
						</div>
						<div className="fr-consent-services" id={idDetails} hidden={!sontDetailsOuverts}>
							{services.map((service) => (
								<ServiceConsentementDetail
									key={service.id}
									service={service}
									autorise={choix[service.id]}
									onChoisir={(autorise) => onChoisir([service], autorise)} />
							))}
						</div>
					</>
				)}
			</fieldset>
		</div>
	);
}

type ServiceConsentementDetailProps = {
	service: ServiceConsentement
	autorise: boolean | undefined
	onChoisir: (autorise: boolean) => void
};

function ServiceConsentementDetail({ service, autorise, onChoisir }: ServiceConsentementDetailProps) {
	const idLegende = `service-${service.id}-legende`;
	const idDescription = `service-${service.id}-description`;

	return (
		<div className="fr-consent-service">
			<fieldset
				className="fr-fieldset fr-fieldset--inline"
				aria-labelledby={service.description ? `${idLegende} ${idDescription}` : idLegende}>
				<legend id={idLegende} className="fr-consent-service__title">{service.nom}</legend>
				<div className="fr-consent-service__radios fr-fieldset--inline">
					<RadioConsentement
						id={`consentement-service-${service.id}-accepter`}
						name={`consentement-service-${service.id}`}
						label="Accepter"
						checked={autorise === true}
						onChange={() => onChoisir(true)} />
					<RadioConsentement
						id={`consentement-service-${service.id}-refuser`}
						name={`consentement-service-${service.id}`}
						label="Refuser"
						checked={autorise === false}
						onChange={() => onChoisir(false)} />
				</div>
				{service.description && (
					<div id={idDescription} className="fr-consent-service__desc" dangerouslySetInnerHTML={{ __html: service.description }} />
				)}
			</fieldset>
		</div>
	);
}

type RadioConsentementProps = {
	id: string
	name: string
	label: string
	checked: boolean
	disabled?: boolean
	onChange: () => void
};

function RadioConsentement({ id, name, label, checked, disabled, onChange }: RadioConsentementProps) {
	return (
		<div className="fr-radio-group">
			<input type="radio" id={id} name={name} checked={checked} disabled={disabled} onChange={onChange} />
			<label className="fr-label" htmlFor={id}>{label}</label>
		</div>
	);
}
