import { useRouter } from 'next/router';
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useRef, useState } from 'react';

import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { ComboboxPays } from '~/client/components/ui/Form/Combobox/ComboboxPays';
import { Input } from '~/client/components/ui/Form/Input';
import { SelectMultiple } from '~/client/components/ui/Form/Select/SelectMultiple';
import { tempsDeTravailEures } from '~/client/domain/codesTempsTravailEures';
import { paysEuropeList } from '~/client/domain/pays';
import { Button } from '~/client/dsfr';
import { useEmploiEuropeQuery } from '~/client/hooks/useEmploiEuropeQuery';
import { getFormAsQuery } from '~/client/utils/form.util';
import { niveauDEtudes } from '~/server/emplois-europe/domain/niveauDEtudes';
import { secteurActiviteEures } from '~/server/emplois-europe/infra/secteurActiviteEures';
import { typesContratEures } from '~/server/emplois-europe/infra/typesContratEures';

export function FormulaireRechercheEmploisEurope() {
	const rechercheEmploiEuropeForm = useRef<HTMLFormElement>(null);

	const queryParams = useEmploiEuropeQuery();
	const {
		motCle,
		libellePays,
		codePays,
		typeContrat,
		niveauEtude,
		secteurActivite,
		tempsDeTravail,
	} = queryParams;
	const router = useRouter();

	const [inputMotCle, setInputMotCle] = useState<string>(motCle ?? '');
	const [inputTypeContrat, setInputTypeContrat] = useState(typeContrat ? typeContrat.split(',') : []);
	const [inputTempsDeTravail, setInputTempsDeTravail] = useState(tempsDeTravail ? tempsDeTravail.split(',') : []);
	const [inputNiveauEtude, setInputNiveauEtude] = useState(niveauEtude ? niveauEtude.split(',') : []);
	const [inputSecteurActivite, setInputSecteurActivite] = useState(secteurActivite ? secteurActivite.split(',') : []);
	const localisationDefaultValue = (codePays && libellePays)
		? { code: codePays, label: libellePays }
		: undefined;

	function updateRechercherEmploiEuropeQueryParams(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const query = getFormAsQuery(event.currentTarget, queryParams);
		return router.push({ query }, undefined, { shallow: true });
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
			className="border--blue fr-p-5w"
			ref={rechercheEmploiEuropeForm}
			aria-label="Rechercher une offre d'emploi en Europe"
			onSubmit={updateRechercherEmploiEuropeQueryParams}
			role="search">
			<h2 className="fr-h4 fr-mb-5w">Trouvez votre emploi en Europe</h2>
			<div className="fr-grid-row fr-grid-row--gutters">
				<div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
					<Champ className="fr-input-group">
						<Champ.Label>
							Métier, mot-clé ou entreprise
							<Champ.Label.Complement>Exemple : boulanger, marketing, Google</Champ.Label.Complement>
						</Champ.Label>
						<Champ.Input
							render={Input}
							autoFocus
							value={inputMotCle}
							name="motCle"
							onChange={(event: ChangeEvent<HTMLInputElement>) => setInputMotCle(event.currentTarget.value)} />
						<Champ.Error />
					</Champ>
				</div>
				<div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
					<ComboboxPays
						paysList={paysEuropeList}
						labelComplement="Exemple : Belgique, Allemagne"
						defaultValue={localisationDefaultValue}
						placeholder="Sélectionnez vos choix" />
				</div>
				<div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
					<Champ className="fr-select-group">
						<Champ.Label>
							Type de contrat
							<Champ.Label.Complement>Exemple : Alternance, Contrat déterminé</Champ.Label.Complement>
						</Champ.Label>
						<Champ.Input
							render={SelectMultiple}
							optionsAriaLabel="type de contrat"
							onChange={(option) => onChangeMultipleSelect(option, setInputTypeContrat)}
							name="typeContrat"
							value={inputTypeContrat}>
							{typesContratEures.map((option) =>
								<SelectMultiple.Option key={option.libellé} value={option.valeur}>{option.libellé}</SelectMultiple.Option>,
							)}
						</Champ.Input>
						<Champ.Error />
					</Champ>
				</div>
				<div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
					<Champ className="fr-select-group">
						<Champ.Label>
							Temps de travail
							<Champ.Label.Complement>Exemple : Temps plein, temps partiel</Champ.Label.Complement>
						</Champ.Label>
						<Champ.Input
							render={SelectMultiple}
							optionsAriaLabel="temps de travail"
							onChange={(option) => onChangeMultipleSelect(option, setInputTempsDeTravail)}
							name="tempsDeTravail"
							value={inputTempsDeTravail}>
							{tempsDeTravailEures.map((option) =>
								<SelectMultiple.Option key={option.libellé} value={option.valeur}>{option.libellé}</SelectMultiple.Option>,
							)}
						</Champ.Input>
						<Champ.Error />
					</Champ>
				</div>
				<div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
					<Champ className="fr-select-group">
						<Champ.Label>
						Niveau d‘études demandé
							<Champ.Label.Complement>Exemple : Master, Bachelor</Champ.Label.Complement>
						</Champ.Label>
						<Champ.Input
							render={SelectMultiple}
							optionsAriaLabel="niveau d‘études"
							onChange={(option) => onChangeMultipleSelect(option, setInputNiveauEtude)}
							name="niveauEtude"
							value={inputNiveauEtude}>
							{niveauDEtudes.map((option) =>
								<SelectMultiple.Option key={option.libellé} value={option.valeur}>{option.libellé}</SelectMultiple.Option>,
							)}
						</Champ.Input>
						<Champ.Error />
					</Champ>
				</div>
				<div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
					<Champ className="fr-select-group">
						<Champ.Label>
							Domaines
							<Champ.Label.Complement>Exemple : Agriculture, Communication</Champ.Label.Complement>
						</Champ.Label>
						<Champ.Input
							render={SelectMultiple}
							optionsAriaLabel="secteur d‘activité"
							onChange={(option) => onChangeMultipleSelect(option, setInputSecteurActivite)}
							name="secteurActivite"
							value={inputSecteurActivite}>
							{secteurActiviteEures.map((option) =>
								<SelectMultiple.Option key={option.libellé} value={option.valeur}>{option.libellé}</SelectMultiple.Option>,
							)}
						</Champ.Input>
						<Champ.Error />
					</Champ>
				</div>
				<div className="fr-m-auto fr-mt-4w">
					<Button className="fr-btn--lg"
						label="Rechercher"
						type="submit" />
				</div>
			</div>
		</form>
	);
}
