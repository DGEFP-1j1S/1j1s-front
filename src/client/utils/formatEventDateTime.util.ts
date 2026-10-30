// NOTE : formaté côté serveur depuis le rendu serveur des recherches : la langue et le fuseau sont fixés pour ne pas
// dépendre de la machine (et pour que le rendu navigateur soit identique). Les évènements ont lieu en France.
const LANGUE = 'fr-FR';
const FUSEAU_HORAIRE = 'Europe/Paris';

export function formatEventDateTime(dateDebut: string, dateFin: string) {
	const dateTimeDebut = new Date(dateDebut);
	const dateTimeFin = new Date(dateFin);

	if (isSameDate(dateTimeDebut, dateTimeFin)) {
		return `${getLongDate(dateTimeDebut)} de ${getTime(dateTimeDebut)} à ${getTime(dateTimeFin)}`;
	}

	if (timeIsZero(dateTimeDebut)) {
		return `${getLongDate(dateTimeDebut)} - ${getLongDate(dateTimeFin)}`;
	}

	return `${getLongDate(dateTimeDebut)} à ${getTime(dateTimeDebut)} - ${getLongDate(dateTimeFin)} à ${getTime(dateTimeFin)}`;
}

export function getLongDate(date: Date) {
	return date.toLocaleString(LANGUE, {
		day: 'numeric',
		month: 'long',
		timeZone: FUSEAU_HORAIRE,
		weekday: 'short',
	});
}

export function getTime(date: Date) {
	return date.toLocaleTimeString(LANGUE, { hour: '2-digit', minute:'2-digit', timeZone: FUSEAU_HORAIRE });
}

function isSameDate(dateDebut: Date, dateFin: Date) {
	const jourEnFrance = (date: Date) => date.toLocaleDateString(LANGUE, { timeZone: FUSEAU_HORAIRE });
	return jourEnFrance(dateDebut) === jourEnFrance(dateFin);
}

function timeIsZero(dateDebut: Date) {
	return getTime(dateDebut) === '00:00';
}
