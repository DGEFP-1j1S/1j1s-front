export function getCapitalizedItems(label: string) {
	const SPLIT_SEPARATOR = ' / ';
	const labelSplit = label.split(SPLIT_SEPARATOR);
	for (let i = 0; i < labelSplit.length; i++) {
		labelSplit[i] = labelSplit[i].charAt(0).toUpperCase() + labelSplit[i].slice(1);
	}
	return labelSplit.join(SPLIT_SEPARATOR);
};
