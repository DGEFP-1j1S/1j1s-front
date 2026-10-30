import React, { useCallback, useId, useState } from "react";
import { useRange, UseRangeProps } from "react-instantsearch";

import { Label } from "~/client/components/ui/Form/Label";

interface MeilisearchRangeProps {
	labelMinimum: string
	labelMaximum: string
	unite: string
	min: number
	max: number
}

export function MeilisearchRange(props: UseRangeProps & MeilisearchRangeProps) {
	const {
		refine,
		start,
	} = useRange(props);

	const { labelMinimum, labelMaximum, unite, min, max } = props;
	type EmptyInput = "";
	const [minValue, setMinValue] = useState<number | EmptyInput>("");
	const [maxValue, setMaxValue] = useState<number | EmptyInput>("");
	const [previousStart, setPreviousStart] = useState(start);

	if (start[0] !== previousStart[0] || start[1] !== previousStart[1]) {
		setPreviousStart(start);
		if (start[0] === -Infinity) setMinValue("");
		if (start[1] === Infinity) setMaxValue("");
	}

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

	const refineRange = useCallback(() => {
		const from = minValue || undefined;
		const to = maxValue || undefined;
		refine([from, to]);
	}, [minValue, maxValue, refine]);

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
						onChange={onMinInputChange}
						onBlur={refineRange} />
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
						onChange={onMaxInputChange}
						onBlur={refineRange} />
				</div>
			</div>
		</div>
	);
}
