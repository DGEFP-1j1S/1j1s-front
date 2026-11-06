import React, { useCallback, useId, useState } from "react";
import { Label } from "~/client/components/ui/Form/Label";

interface ChampIntervalleProps {
	legend: string
	labelMinimum: string
	labelMaximum: string
	unite: string
	min: number
	max: number
	name: string // les bornes sont envoyées dans le formulaire sous les noms `${name}Min` et `${name}Max`
	valeurMinInitiale?: number
	valeurMaxInitiale?: number
}

export function ChampIntervalle(props: ChampIntervalleProps) {
	const { legend, labelMinimum, labelMaximum, unite, min, max, name, valeurMinInitiale, valeurMaxInitiale } = props;

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
		<fieldset className="fr-fieldset">
			<legend className="fr-fieldset__legend">{legend}</legend>
			<div className="fr-fieldset__element fr-fieldset__element--inline flex-grow--1">
				<div className="fr-input-group">
					<Label htmlFor={inputMinId}>{labelMinimum} ({unite})</Label>
					<input
						id={inputMinId}
						name={`${name}Min`}
						className="fr-input"
						type="number"
						min={min}
						max={max}
						value={minValue}
						onChange={onMinInputChange}/>
				</div>
			</div>
			<div className="fr-fieldset__element fr-fieldset__element--inline flex-grow--1">
				<div className="fr-input-group">
					<Label htmlFor={inputMaxId}>{labelMaximum} ({unite})</Label>
					<input
						id={inputMaxId}
						name={`${name}Max`}
						className="fr-input"
						type="number"
						min={min}
						max={max}
						value={maxValue}
						onChange={onMaxInputChange}/>
				</div>
			</div>
		</fieldset>
	);
}
