import React, { useMemo, useState } from 'react';

import {
	StageEnum,
} from '~/client/components/features/OffreDeStage/Déposer/Étape2Stage/StageDeposerOffreFormulaireÉtape2Stage';
import styles
	from '~/client/components/features/OffreDeStage/Déposer/Étape2Stage/StageDeposerOffreFormulaireÉtape2Stage.module.scss';
import { OffreDeStageDeposeeStage } from '~/client/components/features/OffreDeStage/Déposer/StageDeposerOffre';
import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { Input } from '~/client/components/ui/Form/Input';

const MAX_CMS_DATE = '9999-12-31';

export function InputDateDeDebut(props: { displayDateDeDebutPrecise: boolean, informationsStage: OffreDeStageDeposeeStage | null }) {
	const disableBeforeToday: string = useMemo(() => {
		return new Date().toISOString().split('T')[0];
	}, []);

	const [dateDeDebutMin, setDateDeDebutMin] = useState<string | undefined>(props.informationsStage?.dateDeDebutMin ?? undefined);
	const [dateDeDebutMax, setDateDeDebutMax] = useState<string | undefined>(props.informationsStage?.dateDeDebutMax ?? undefined);

	// NOTE (DORO - 05-03-2024): Duplication de l'implémentation de input=date pour les navigateurs qui ne le supportent pas
	function validationDateDeDebutMin(value: string | undefined): string {
		if (!value) return 'La date est obligatoire';

		const isFormatDeDateInvalide = !Date.parse(value);
		if (isFormatDeDateInvalide) return 'La date doit être au format AAAA-MM-JJ';

		const dateNow = new Date().setHours(0, 0, 0, 0);

		const isDateAnterieurAujourdhui = Date.parse(value) < dateNow;
		if (isDateAnterieurAujourdhui) return 'La date doit être supérieure ou égale à la date du jour';

		const isDateDepasseDateMaxCms = !!dateDeDebutMax && Date.parse(value) > Date.parse(dateDeDebutMax);
		if (isDateDepasseDateMaxCms) return 'La date doit être valide';

		return '';
	}

	// NOTE (DORO - 05-03-2024): Duplication de l'implémentation de input=date pour les navigateurs qui ne le supportent pas
	function validationDateDeDebutMax(value: string | undefined): string {
		if (!value) return 'La date est obligatoire';

		const isFormatDeDateInvalide = !Date.parse(value);
		if (isFormatDeDateInvalide) return 'La date doit être au format AAAA-MM-JJ';

		const dateToValidate = Date.parse(value);

		const isDateDebutMaxAnterieurDateDebutMin = !!dateDeDebutMin && dateToValidate < Date.parse(dateDeDebutMin);
		if (isDateDebutMaxAnterieurDateDebutMin) return 'La date doit être supérieure ou égale à la date de début';

		const isDateDepasseDateMaxCms = dateToValidate > Date.parse(MAX_CMS_DATE);
		if (isDateDepasseDateMaxCms) return 'La date doit être valide';

		return '';
	}

	const patternDate = '^[0-9]{4}-[0-9]{2}-[0-9]{2}$';
	const currentDate = new Date();
	const placeholderDate = `Exemple : ${currentDate.toISOString().slice(0, 10)}`;

	return (
		<>
			{props.displayDateDeDebutPrecise ? (
				<Champ>
					<Champ.Label>
					Date précise du début de stage
					</Champ.Label>
					<Champ.Input
						render={Input}
						type="date"
						name={StageEnum.DATE_DE_DEBUT_MIN}
						defaultValue={dateDeDebutMin}
						required
						min={disableBeforeToday}
						max={'9999-12-31'}
						onChange={(event) => setDateDeDebutMin(event.target.value)}
						validation={(event) => validationDateDeDebutMin(event as string)}
						pattern={patternDate}
						placeholder={placeholderDate} />
					<Champ.Error />
				</Champ>
			)
				: (
					<div className={styles.contenuDateDeDebutInputDate}>
						<Champ>
							<Champ.Label>
						Date de début du stage au plus tôt
							</Champ.Label>
							<Champ.Input
								render={Input}
								type="date"
								name={StageEnum.DATE_DE_DEBUT_MIN}
								defaultValue={dateDeDebutMin}
								required
								min={disableBeforeToday}
								max={'9999-12-31'}
								onChange={(event) => setDateDeDebutMin(event.target.value)}
								validation={(event) => validationDateDeDebutMin(event as string)}
								pattern={patternDate}
								placeholder={placeholderDate} />
							<Champ.Error />
						</Champ>
						<Champ>
							<Champ.Label>
						Date de début du stage au plus tard
							</Champ.Label>
							<Champ.Input
								render={Input}
								type="date"
								name={StageEnum.DATE_DE_DEBUT_MAX}
								defaultValue={dateDeDebutMax}
								required
								min={dateDeDebutMin}
								max={'9999-12-31'}
								onChange={(event) => setDateDeDebutMax(event.target.value)}
								validation={(event) => validationDateDeDebutMax(event as string)}
								pattern={patternDate}
								placeholder={placeholderDate} />
							<Champ.Error />
						</Champ>
					</div>
				)}
		</>
	);
}
