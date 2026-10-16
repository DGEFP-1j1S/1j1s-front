import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { SelectSimple } from '~/client/components/ui/Form/Select/SelectSimple';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import { LocalisationService } from '~/client/services/localisation/localisation.service';
import { isSuccess } from '~/server/errors/either';
import { radiusList } from '~/server/localisations/domain/localisation';
import { Commune } from '~/server/localisations/domain/localisationAvecCoordonnées';

import { Combobox } from '../index';

type ComboboxProps = React.ComponentPropsWithoutRef<typeof Combobox>;
type ComboboxRef = React.ComponentRef<typeof Combobox>;

type ComboboxPropsWithOmit = Omit<ComboboxProps, 'label' | 'defaultValue' | 'optionsAriaLabel'>
type FetchStatus = 'init' | 'pending' | 'success' | 'failure';

type ComboboxCommuneProps = {
	label?: string,
	id?: string,
	debounceTimeout?: number,
	defaultCommune?: Commune
	defaultDistance?: string
	showRadiusInput?: boolean
} & ComboboxPropsWithOmit

const MINIMUM_CHARACTER_NUMBER_FOR_SEARCH = 3;
const SEARCH_CHARACTERS_TO_IGNORE = '()&+#$';
const MESSAGE_ERREUR_FETCH = 'Une erreur est survenue lors de la récupération des lieux. Veuillez réessayer plus tard.';
const MESSAGE_PAS_DE_RESULTAT = 'Aucune proposition ne correspond à votre saisie. Vérifiez que votre saisie correspond bien à un lieu. Exemple : Paris, ...';
const MESSAGE_CHARGEMENT = 'Chargement ...';
const MESSAGE_CHAMP_VIDE = 'Commencez à saisir au moins 3 caractères ou le code postal de la ville, puis sélectionnez votre localisation';
const DEFAULT_RADIUS_VALUE = '10';
const DEFAULT_DEBOUNCE_TIMEOUT = 200;

function isUserInputValid(userInput: string) {
	const regexSearchCharToIgnore = new RegExp(`[${SEARCH_CHARACTERS_TO_IGNORE}]`, 'g');
	const userInputWithoutSearchCharToIgnore = userInput.replace(regexSearchCharToIgnore, '');
	const userInputWithoutSearchCharToIgnoreTrimed = userInputWithoutSearchCharToIgnore.trim();

	return userInputWithoutSearchCharToIgnoreTrimed.length >= MINIMUM_CHARACTER_NUMBER_FOR_SEARCH;
}

function formatLibelle(ville: string, codePostal: string) {
	return `${ville} (${codePostal})`;
}

function findMatchingOptionFromUserInput(userInput: string, communeList: Array<Commune>) {
	return communeList.find((commune) => userInput === `${commune.ville} (${commune.codePostal})`);
}

function doNothing() {
	return;
}

export const ComboboxCommune = React.forwardRef<ComboboxRef, ComboboxCommuneProps>(function ComboboxCommune(props, ref) {
	const {
		label = 'Localisation',
		onChange: onChangeProps = doNothing,
		defaultCommune: defaultCommuneProps,
		defaultDistance: defaultDistanceProps,
		debounceTimeout = DEFAULT_DEBOUNCE_TIMEOUT,
		showRadiusInput = false,
		...rest
	} = props;
	const localisationService = useDependency<LocalisationService>('localisationService');

	const [communeOptions, setCommuneOptions] = useState<Array<Commune>>(defaultCommuneProps ? [defaultCommuneProps] : []);
	const [userInput, setUserInput] = useState<string>(defaultCommuneProps ? formatLibelle(defaultCommuneProps.ville, defaultCommuneProps.codePostal) : '');

	const [status, setStatus] = useState<FetchStatus>('init');

	const matchingOption = findMatchingOptionFromUserInput(userInput, communeOptions);

	const rechercherCommunesWithUserInputValid = useCallback(async (userInputCommune: string) => {
		const response = await localisationService.rechercherCommune(userInputCommune);
		if (response && isSuccess(response)) {
			setStatus('success');
			setCommuneOptions(response.result.résultats);
		} else {
			setStatus('failure');
		}
	}, [localisationService, setCommuneOptions]);

	const handleRechercherWithDebounce = useMemo(() => {
		return debounce(rechercherCommunesWithUserInputValid, debounceTimeout);
	}, [rechercherCommunesWithUserInputValid, debounceTimeout]);

	const rechercherCommunes = useCallback(function (commune: string) {
		if (isUserInputValid(commune)) {
			setStatus('pending');
			handleRechercherWithDebounce(commune);
		}
	}, [handleRechercherWithDebounce]);


	useEffect(() => {
		return () => {
			handleRechercherWithDebounce.cancel();
		};
	}, [handleRechercherWithDebounce]);

	const isListeDeResultatEmpty = communeOptions.length === 0;
	const isCommuneValid = matchingOption?.code;
	return (
		<>
			<div>
				<Champ>
					<Champ.Label>
						{label}
						<Champ.Label.Complement>Exemples : Paris, Béziers…</Champ.Label.Complement>
					</Champ.Label>
					<Champ.Input render={Combobox}
											 ref={ref}
											 filter={Combobox.noFilter}
											 valueName="codeCommune"
											 autoComplete="off"
											 value={userInput}
											 optionsAriaLabel="communes"
											 onChange={(event, newValue) => {
												 rechercherCommunes(newValue);
												 setUserInput(newValue);
												 onChangeProps(event, newValue);
											 }}
											 requireValidOption
											 {...rest}>
						{
							(communeOptions.map((commune: Commune) => (
								<Combobox.Option key={commune.code} value={commune.code}>
									{formatLibelle(commune.ville, commune.codePostal)}
								</Combobox.Option>
							)))
						}
						<Combobox.AsyncMessage>
							{
								!isUserInputValid(userInput) && MESSAGE_CHAMP_VIDE
								|| status === 'failure' && MESSAGE_ERREUR_FETCH
								|| status === 'pending' && MESSAGE_CHARGEMENT
								|| isListeDeResultatEmpty && MESSAGE_PAS_DE_RESULTAT
								|| ''
							}
						</Combobox.AsyncMessage>
					</Champ.Input>
					<Champ.Error />
				</Champ>
				<input type="hidden" name="ville" value={matchingOption?.ville ?? ''} />
				<input type="hidden" name="latitudeCommune" value={matchingOption?.coordonnées.latitude ?? ''} />
				<input type="hidden" name="longitudeCommune" value={matchingOption?.coordonnées.longitude ?? ''} />
				<input type="hidden" name="codePostal" value={matchingOption?.codePostal ?? ''} />
			</div>
			{showRadiusInput && isCommuneValid && userInput && 	(
				<Champ>
					<Champ.Label>
					Rayon
						<Champ.Label.Complement>Exemple : 30 km</Champ.Label.Complement>
					</Champ.Label>
					<Champ.Input
						render={SelectSimple}
						optionsAriaLabel={'Rayons'}
						name={'distanceCommune'}
						defaultValue={defaultDistanceProps || DEFAULT_RADIUS_VALUE}>
						{radiusList.map((option) =>
							<SelectSimple.Option key={option.libellé} value={option.valeur}>{option.libellé}</SelectSimple.Option>,
						)}
					</Champ.Input>
					<Champ.Error />
				</Champ>
			)}
		</>
	);
});
