import React, { useEffect, useRef, useState } from 'react';

import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { ComboboxMultiple } from '~/client/components/ui/Form/Combobox/ComboboxMultiple/ComboboxMultiple';
import { Either, isSuccess } from '~/server/errors/either';

interface ChampSuggestionsMultiplesProps {
	label: string
	labelComplement?: string
	name: string
	optionsAriaLabel: string
	valeursInitiales: Array<string>
	rechercher: (saisie: string) => Promise<Either<Array<string>>>
	messagePasDeResultat: string
	placeholder: (nombreDeValeursCochees: number) => string | undefined
}

/**
 * Champ de saisie qui propose des valeurs à cocher (ex : localisations), cherchées pendant la frappe.
 * Les valeurs cochées restent en tête de liste et sont envoyées dans le formulaire sous le nom `name`.
 */
export function ChampSuggestionsMultiples({
	label,
	labelComplement,
	name,
	optionsAriaLabel,
	valeursInitiales,
	rechercher,
	messagePasDeResultat,
	placeholder,
}: ChampSuggestionsMultiplesProps) {
	const [valeursCochees, setValeursCochees] = useState(valeursInitiales);
	const [saisie, setSaisie] = useState('');
	const [suggestions, setSuggestions] = useState<Array<string>>([]);
	const derniereRecherche = useRef(0);

	async function chargerSuggestions(nouvelleSaisie: string) {
		// NOTE : on ignore les réponses arrivées après une recherche plus récente
		const numeroRecherche = ++derniereRecherche.current;
		const reponse = await rechercher(nouvelleSaisie);
		if (numeroRecherche !== derniereRecherche.current) return;
		setSuggestions(isSuccess(reponse) ? reponse.result : []);
	}

	useEffect(function chargerLesValeursLesPlusFrequentes() {
		chargerSuggestions('');
		// eslint-disable-next-line react-hooks/exhaustive-deps -- uniquement au montage
	}, []);

	function modifierLaSaisie(nouvelleSaisie: string) {
		setSaisie(nouvelleSaisie);
		chargerSuggestions(nouvelleSaisie);
	}

	function basculer(valeur: string) {
		setValeursCochees((precedentes) => precedentes.includes(valeur)
			? precedentes.filter((precedente) => precedente !== valeur)
			: [...precedentes, valeur]);
	}

	const suggestionsNonCochees = suggestions.filter((suggestion) => !valeursCochees.includes(suggestion));

	return (
		<Champ className="fr-select-group">
			<Champ.Label>
				{label}
				{labelComplement && <Champ.Label.Complement>{labelComplement}</Champ.Label.Complement>}
			</Champ.Label>
			<Champ.Input
				render={ComboboxMultiple}
				optionsAriaLabel={optionsAriaLabel}
				value={valeursCochees}
				onChange={basculer}
				inputValue={saisie}
				onInputValueChange={modifierLaSaisie}
				placeholder={placeholder(valeursCochees.length)}>
				{valeursCochees.map((valeur) => (
					<ComboboxMultiple.Option key={valeur} value={valeur}>{valeur}</ComboboxMultiple.Option>
				))}
				{suggestionsNonCochees.map((valeur) => (
					<ComboboxMultiple.Option key={valeur} value={valeur}>{valeur}</ComboboxMultiple.Option>
				))}
				{saisie && suggestionsNonCochees.length === 0 && <li role="status">{messagePasDeResultat}</li>}
			</Champ.Input>
			{valeursCochees.map((valeur) => (
				<input key={valeur} type="hidden" name={name} value={valeur} />
			))}
			<Champ.Error />
		</Champ>
	);
}
