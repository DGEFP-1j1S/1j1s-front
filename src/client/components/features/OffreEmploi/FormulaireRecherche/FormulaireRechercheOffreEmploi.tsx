import { useRouter } from 'next/router';
import React, {
	ChangeEvent,
	Dispatch,
	FormEvent,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';

import styles
	from '~/client/components/features/OffreEmploi/FormulaireRecherche/FormulaireRechercheOffreEmploi.module.scss';
import { ButtonComponent } from '~/client/components/ui/Button/ButtonComponent';
import { Checkbox } from '~/client/components/ui/Checkbox/Checkbox';
import { FilterAccordion } from '~/client/components/ui/FilterAccordion/FilterAccordion';
import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { ComboboxLocalisation } from '~/client/components/ui/Form/Combobox/ComboboxLocalisation/ComboboxLocalisation';
import {
	mapToDefaultLocalisation,
} from '~/client/components/ui/Form/Combobox/ComboboxLocalisation/defaultLocalisation/mapToDefaultLocalisation';
import { Input } from '~/client/components/ui/Form/Input';
import { SelectMultiple } from '~/client/components/ui/Form/Select/SelectMultiple';
import { SelectSimple } from '~/client/components/ui/Form/Select/SelectSimple';
import { Icon } from '~/client/components/ui/Icon/Icon';
import { ModalComponent } from '~/client/components/ui/Modal/ModalComponent';
import { Radio } from '~/client/components/ui/Radio/Radio';
import { référentielDomaineList } from '~/client/domain/référentielDomaineList';
import useBreakpoint from '~/client/hooks/useBreakpoint';
import { useOffreQuery } from '~/client/hooks/useOffreQuery';
import { getFormAsQuery } from '~/client/utils/form.util';
import {
	mapRéférentielDomaineToOffreCheckboxFiltre,
	mapTypeDeContratToOffreEmploiCheckboxFiltre,
} from '~/client/utils/offreEmploi.mapper';
import { estQueryIdentiqueAAsPath } from '~/client/utils/queryString.util';
import { EXPÉRIENCE, TEMPS_DE_TRAVAIL_LIST, TYPE_DE_CONTRAT_LIST } from '~/server/offres/domain/offre';

function updateFilterQuery(filterQuery: Array<string>, filterToToggle: string) {
	const currentString = filterQuery.filter((element) => element);
	const indexOfValue = currentString.indexOf(filterToToggle);
	if (indexOfValue >= 0) {
		currentString.splice(indexOfValue, 1);
	} else {
		currentString.push(filterToToggle);
	}

	return currentString;
}

type FormulaireRechercheOffreEmploiProps = {
	enEtatErreur?: boolean
}

export function FormulaireRechercheOffreEmploi({ enEtatErreur = false }: FormulaireRechercheOffreEmploiProps) {
	const rechercheOffreEmploiForm = useRef<HTMLFormElement>(null);

	const [isFiltresAvancésMobileOpen, setIsFiltresAvancésMobileOpen] = useState(false);

	const queryParams = useOffreQuery();
	const { isSmallScreen } = useBreakpoint();
	const router = useRouter();

	const [inputTypeDeContrat, setInputTypeDeContrat] = useState(queryParams.typeDeContrats ? queryParams.typeDeContrats.split(',') : []);
	const [inputExpérience, setInputExpérience] = useState(queryParams.experienceExigence ?? '');
	const [inputTempsDeTravail, setInputTempsDeTravail] = useState(queryParams.tempsDeTravail ?? '');
	const [inputDomaine, setInputDomaine] = useState(queryParams.grandDomaine ? queryParams.grandDomaine.split(',') : []);

	const inputLocalisation = mapToDefaultLocalisation(queryParams.codeLocalisation, queryParams.typeLocalisation, queryParams.nomLocalisation, queryParams.codePostalLocalisation);

	useEffect(function fermerFiltresAvancésSurÉcranLarge() {
		if (!isSmallScreen) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setIsFiltresAvancésMobileOpen(false);
		}
	}, [isSmallScreen]);

	const applyFiltresAvancés = useCallback(() => {
		setIsFiltresAvancésMobileOpen(false);
		rechercheOffreEmploiForm.current?.dispatchEvent(
			new Event('submit', { bubbles: true, cancelable: true }),
		);
	}, []);

	const toggleTypeDeContrat = useCallback((value: string) => {
		setInputTypeDeContrat(updateFilterQuery(inputTypeDeContrat, value));
	}, [inputTypeDeContrat]);

	const toggleDomaine = useCallback((value: string) => {
		setInputDomaine(updateFilterQuery(inputDomaine, value));
	}, [inputDomaine]);

	function updateRechercherOffreEmploiQueryParams(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		const query = getFormAsQuery(event.currentTarget, queryParams);
		// NOTE: en état d‘erreur, resoumettre à l‘identique est le geste de réessai de l‘utilisateur : la garde doit être levée.
		if (!enEtatErreur && estQueryIdentiqueAAsPath(router.asPath, query)) return;
		router.push({ query }, undefined, { scroll: false });
	}

	function getValueSelected(option: HTMLElement) {
		return option.getAttribute('data-value') ?? '';
	}


	function onChangeMultipleSelect(option: HTMLElement, setInputValue: Dispatch<SetStateAction<Array<string>>>) {
		const value = option.getAttribute('data-value') ?? '';
		setInputValue((previous) => {
			const indexOfValue = previous.indexOf(value);
			if (value && indexOfValue === -1) {
				previous.push(value);
			} else {
				previous.splice(indexOfValue, 1);
			}
			return previous;
		});
	}

	return (
		<form
			ref={rechercheOffreEmploiForm}
			aria-label="Rechercher une offre d'emploi"
			className={styles.rechercheOffreForm}
			onSubmit={updateRechercherOffreEmploiQueryParams}
			role="search">
			<div className={styles.filtres}>
				<Champ className={styles.metier}>
					<Champ.Label>
						Métier, mot-clé (minimum 2 caractères)
						<Champ.Label.Complement>Exemples : boulanger, informatique…</Champ.Label.Complement>
					</Champ.Label>
					<Champ.Input
						render={Input}
						defaultValue={queryParams.motCle}
						name="motCle"
						minLength={2} />
					<Champ.Error />
				</Champ>

				<div className={styles.localisation}>
					<ComboboxLocalisation defaultValue={inputLocalisation} />
				</div>

				{isSmallScreen && (
					<div>
						<ButtonComponent
							appearance="quaternary"
							icon={<Icon name="filter" />}
							iconPosition="right"
							label="Filtrer ma recherche"
							onClick={() => setIsFiltresAvancésMobileOpen(!isFiltresAvancésMobileOpen)} />
						<input type="hidden" name="typeDeContrats" value={inputTypeDeContrat} />
						<input type="hidden" name="tempsDeTravail" value={inputTempsDeTravail} />
						<input type="hidden" name="experienceExigence" value={inputExpérience} />
						<input type="hidden" name="grandDomaine" value={inputDomaine} />
					</div>
				)}

				{!isSmallScreen && (
					<>
						<Champ className={styles.typeContrat}>
							<Champ.Label>
								Types de contrats
								<Champ.Label.Complement>Exemple : CDI, CDD…</Champ.Label.Complement>
							</Champ.Label>
							<Champ.Input
								render={SelectMultiple}
								optionsAriaLabel={'Types de contrats'}
								name={'typeDeContrats'}
								onChange={(option) => onChangeMultipleSelect(option, setInputTypeDeContrat)}
								value={inputTypeDeContrat}>
								{mapTypeDeContratToOffreEmploiCheckboxFiltre(TYPE_DE_CONTRAT_LIST).map((option) =>
									<SelectMultiple.Option key={option.libellé} value={option.valeur}>{option.libellé}</SelectMultiple.Option>,
								)}
							</Champ.Input>
							<Champ.Error />
						</Champ>

						<Champ className={styles.tempsTravail}>
							<Champ.Label>
								Temps de travail
								<Champ.Label.Complement>Exemple : temps plein, temps partiel…</Champ.Label.Complement>
							</Champ.Label>
							<Champ.Input
								render={SelectSimple}
								optionsAriaLabel={'Temps de travail'}
								name={'tempsDeTravail'}
								onChange={(option) => setInputTempsDeTravail(getValueSelected(option))}
								value={inputTempsDeTravail}>
								{TEMPS_DE_TRAVAIL_LIST.map((option) =>
									<SelectSimple.Option key={option.libellé} value={option.valeur}>{option.libellé}</SelectSimple.Option>,
								)}
							</Champ.Input>
							<Champ.Error />
						</Champ>

						<Champ className={styles.niveau}>
							<Champ.Label>
								Niveau demandé
								<Champ.Label.Complement>Exemple : De 1 à 3 ans</Champ.Label.Complement>
							</Champ.Label>
							<Champ.Input
								render={SelectSimple}
								optionsAriaLabel={'Niveau demandé'}
								name={'experienceExigence'}
								onChange={(option) => setInputExpérience(getValueSelected(option))}
								value={inputExpérience}>
								{EXPÉRIENCE.map((option) =>
									<SelectSimple.Option key={option.libellé} value={option.valeur}>{option.libellé}</SelectSimple.Option>,
								)}
							</Champ.Input>
							<Champ.Error />
						</Champ>

						<Champ className={styles.domaines}>
							<Champ.Label>
								Domaines
								<Champ.Label.Complement>Exemple : Commerce, Immobilier…</Champ.Label.Complement>
							</Champ.Label>
							<Champ.Input
								render={SelectMultiple}
								optionsAriaLabel={'Domaines'}
								name={'grandDomaine'}
								onChange={(option) => onChangeMultipleSelect(option, setInputDomaine)}
								value={inputDomaine}>
								{mapRéférentielDomaineToOffreCheckboxFiltre(référentielDomaineList).map((option) =>
									<SelectMultiple.Option key={option.libellé} value={option.valeur}>{option.libellé}</SelectMultiple.Option>,
								)}
							</Champ.Input>
							<Champ.Error />
						</Champ>
					</>
				)}
			</div>
			<div className={styles.buttonRechercher}>
				<ButtonComponent
					icon={<Icon name="magnifying-glass" />}
					iconPosition="right"
					label="Rechercher"
					type="submit" />
			</div>

			<ModalComponent
				close={() => setIsFiltresAvancésMobileOpen(!isFiltresAvancésMobileOpen)}
				closeTitle="Fermer les filtres"
				isOpen={isFiltresAvancésMobileOpen}
				aria-labelledby="dialog_label">
				<ModalComponent.Title>
					<Icon name="menu" />
					<span id="dialog_label">Filtrer ma recherche</span>
				</ModalComponent.Title>
				<ModalComponent.Content className={styles.modalfiltresAvancesContenu}>
					<FilterAccordion open>
						<FilterAccordion.Title id="type-de-contrat-title">Type de contrat</FilterAccordion.Title>
						<FilterAccordion.Content>
							<fieldset aria-labelledby="type-de-contrat-title">
								{TYPE_DE_CONTRAT_LIST.map((typeDeContrat, index) => (
									<Checkbox
										name="typeDeContrats"
										key={`Type de contrat${index}`}
										label={typeDeContrat.libelléLong}
										onChange={(e: ChangeEvent<HTMLInputElement>) => toggleTypeDeContrat(e.target.value)}
										value={typeDeContrat.valeur}
										checked={inputTypeDeContrat.includes(typeDeContrat.valeur)} />
								))}
							</fieldset>
						</FilterAccordion.Content>
					</FilterAccordion>
					<FilterAccordion>
						<FilterAccordion.Title id="temps-de-travail-title">Temps de travail</FilterAccordion.Title>
						<FilterAccordion.Content>
							<fieldset aria-labelledby="temps-de-travail-title">
								{TEMPS_DE_TRAVAIL_LIST.map((tempsDeTravail, index) => (
									<Radio
										key={index}
										label={tempsDeTravail.libellé}
										name="tempsDeTravail"
										checked={inputTempsDeTravail === tempsDeTravail.valeur}
										onChange={() => setInputTempsDeTravail(tempsDeTravail.valeur)}
										value={tempsDeTravail.valeur} />
								))}
							</fieldset>
						</FilterAccordion.Content>
					</FilterAccordion>
					<FilterAccordion>
						<FilterAccordion.Title id="niveau-demande-title">Niveau demandé</FilterAccordion.Title>
						<FilterAccordion.Content>
							<fieldset aria-labelledby="niveau-demande-title">
								{EXPÉRIENCE.map((expérience) => (
									<Radio
										key={expérience.libellé}
										label={expérience.libellé}
										name="experienceExigence"
										checked={inputExpérience === expérience.valeur}
										onChange={() => setInputExpérience(expérience.valeur)}
										value={expérience.valeur} />
								))}
							</fieldset>
						</FilterAccordion.Content>
					</FilterAccordion>
					<FilterAccordion>
						<FilterAccordion.Title id="domaine-title">Domaine</FilterAccordion.Title>
						<FilterAccordion.Content>
							<fieldset aria-labelledby="domaine-title">
								{référentielDomaineList.map((domaine, index) => (
									<Checkbox
										name={'grandDomaine'}
										key={`Domaine${index}`}
										label={domaine.libelle}
										onChange={(e: ChangeEvent<HTMLInputElement>) => toggleDomaine(e.target.value)}
										value={domaine.code}
										checked={inputDomaine.includes(domaine.code)} />
								))}
							</fieldset>
						</FilterAccordion.Content>
					</FilterAccordion>
				</ModalComponent.Content>
				<ModalComponent.Footer>
					<div className={styles.modalfiltresAvancesButton}>
						<ButtonComponent
							icon={<Icon name="angle-right" />}
							iconPosition="right"
							label="Appliquer les filtres"
							onClick={applyFiltresAvancés} />
					</div>
				</ModalComponent.Footer>
			</ModalComponent>
		</form>
	);
}
