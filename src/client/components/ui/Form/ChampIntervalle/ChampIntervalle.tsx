import React, { useCallback, useId, useState } from "react";
import { Label } from "~/client/components/ui/Form/Label";

interface ChampIntervalleProps {
	labelMinimum: string
	labelMaximum: string
	unite: string
	min: number
	max: number
	valeurMinInitiale?: number
	valeurMaxInitiale?: number
}

export function ChampIntervalle(props: ChampIntervalleProps) {
	const { labelMinimum,labelMaximum, unite, min, max, valeurMinInitiale, valeurMaxInitiale } = props;

	type EmptyInput = "";
	const [minValue, setMinValue] = useState<number | EmptyInput>(valeurMinInitiale ?? '');
	const [maxValue, setMaxValue] = useState<number | EmptyInput>(valeurMaxInitiale ?? '');

	const inputMinId = useId();
	const inputMaxId = useId();

	const onMaxInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setMaxValue(value === "" ? value : Number(value));
	}, []);

	const onMinInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setMinValue(value === "" ? value : Number(value));
	}, []);

	return (
		<div className="fr-grid-row fr-grid-row--gutters">
			<div className="fr-col-6">
				<div className="fr-input-group">
					<Label htmlFor={inputMinId}>{labelMinimum} ({unite})</Label>
					<input
						id={inputMinId}
						className="fr-input"
						type="number"
						min={min}
						max={max}
						value={minValue}
						onChange={onMinInputChange}/>
				</div>
			</div>
			<div className="fr-col-6">
				<div className="fr-input-group">
					<Label htmlFor={inputMaxId}>{labelMaximum} ({unite})</Label>
					<input
						id={inputMaxId}
						className="fr-input"
						type="number"
						min={min}
						max={max}
						value={maxValue}
						onChange={onMaxInputChange}/>
				</div>
			</div>
		</div>
	);
}
