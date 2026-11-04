export type Whitelist = Record<string, unknown>;

type FormEntry = [Name, Value | File];
type Name = string;
type Value = string;
type FlattenedFormEntry = [Name, Value];
const NAME_INDEX = 0;
const VALUE_INDEX = 1;

function flattenFiles([key, value]: FormEntry): FlattenedFormEntry {
	return [key, typeof value === 'string' ? value : value.name];
}
function isWhitelisted(whitelist: Whitelist) {
	return (entry: FlattenedFormEntry) => (entry[NAME_INDEX] in whitelist);
}
function isSet(entry: FlattenedFormEntry) {
	const value = entry[VALUE_INDEX];
	return value && value !== 'false';
}

type GroupedFormEntries = Record<Name, Array<Value>>;
function GroupByEntryName(groups: GroupedFormEntries, entry: FlattenedFormEntry): GroupedFormEntries {
	const name = entry[NAME_INDEX];
	if (groups[name] == null) {
		groups[name] = [];
	}
	groups[name].push(entry[VALUE_INDEX]);
	return groups;
}
function joinValues([ name, values ]: [Name, Array<Value>]) {
	return [name, values.join(',')];
}

export function getFormAsQuery(formElement: HTMLFormElement, queryParamsWhitelist: Whitelist, appendPageQueryParam = true): string {
	const formData = new FormData(formElement);
	if (appendPageQueryParam) {
		formData.set('page', '1');
	}

	const groupedEntries = Array.from<FormEntry, FlattenedFormEntry>(formData, flattenFiles)
		.filter(isWhitelisted(queryParamsWhitelist))
		.filter(isSet)
		.reduce(GroupByEntryName, {});

	const flattenedGroupedEntries = Object.entries(groupedEntries)
		.map(joinValues);
	return new URLSearchParams(flattenedGroupedEntries).toString();
}

export function getFormAsQueryAvecValeursRepetees(formElement: HTMLFormElement, queryParamsWhitelist: Whitelist, appendPageQueryParam = true): string {
	const formData = new FormData(formElement);
	if (appendPageQueryParam) {
		formData.set('page', '1');
	}

	const entries = Array.from<FormEntry, FlattenedFormEntry>(formData, flattenFiles)
		.filter(isWhitelisted(queryParamsWhitelist))
		.filter(isSet);
	return new URLSearchParams(entries).toString();
}
