import {
	IsDateDeDebutPrecise,
	StageEnum,
} from '~/client/components/features/OffreDeStage/Déposer/Étape2Stage/StageDeposerOffreFormulaireÉtape2Stage';
import styles
	from '~/client/components/features/OffreDeStage/Déposer/Étape2Stage/StageDeposerOffreFormulaireÉtape2Stage.module.scss';
import { Radio } from '~/client/components/ui/Radio/Radio';

export function RadioIsDatePrecise(props: { checked: boolean, onChange: () => void }) {
	return (
		<div className={styles.contenuDateDeDebutInputRadio}>
			<Radio
				label="Je connais la date précise du début de stage"
				name={StageEnum.IS_DATE_DE_DEBUT_PRECISE}
				value={IsDateDeDebutPrecise.OUI}
				checked={props.checked}
				onChange={props.onChange}
				required />
			<Radio
				label="Je ne connais pas la date précise du début de stage"
				name={StageEnum.IS_DATE_DE_DEBUT_PRECISE}
				value={IsDateDeDebutPrecise.NON}
				checked={!props.checked}
				onChange={props.onChange}
				required />
		</div>
	);
}
