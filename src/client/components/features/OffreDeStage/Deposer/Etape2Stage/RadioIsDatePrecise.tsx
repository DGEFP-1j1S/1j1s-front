import {
	IsDateDeDebutPrecise,
	StageEnum,
} from '~/client/components/features/OffreDeStage/Deposer/Etape2Stage/StageDeposerOffreFormulaireEtape2Stage';
import { Radio } from '~/client/components/ui/Radio/Radio';

export function RadioIsDatePrecise(props: { checked: boolean, onChange: () => void }) {
	return (
		<>
			<div className="fr-fieldset__element">
				<Radio
				label="Je connais la date précise du début de stage"
				name={StageEnum.IS_DATE_DE_DEBUT_PRECISE}
				value={IsDateDeDebutPrecise.OUI}
				checked={props.checked}
				onChange={props.onChange}
				required />
			</div>
			<div className="fr-fieldset__element">
			<Radio
				label="Je ne connais pas la date précise du début de stage"
				name={StageEnum.IS_DATE_DE_DEBUT_PRECISE}
				value={IsDateDeDebutPrecise.NON}
				checked={!props.checked}
				onChange={props.onChange}
				required />
			</div>
		</>
	);
}
