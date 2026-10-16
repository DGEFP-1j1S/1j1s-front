import {
	EtablissementAccompagnement,
	EtablissementAccompagnementAdresse as Adresse,
	EtablissementAccompagnementHoraire as Horaire,
	EtablissementAccompagnementHoraireHeure as Heure,
	isTypeEtablissement,
	JourSemaine,
	TypeÉtablissement,
} from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';
import {
	ResultatRechercheEtablissementPublicResponseAdresseParsed as AdresseParsed,
	ResultatRechercheEtablissementPublicResponseEtablissementPublic as EtablissementPublic,
	ResultatRechercheEtablissementPublicResponsePivotParsed as PivotLocal,
	ResultatRechercheEtablissementPublicResponsePlageOuvertureParsed as PlageOuverture,
	ResultatRechercheEtablissementPublicResponseTelephoneParsed as Telephone,
} from '~/server/etablissement-accompagnement/infra/apiEtablissementPublic.response';

const JOURS_DE_LA_SEMAINE_NOM = [JourSemaine.LUNDI, JourSemaine.MARDI, JourSemaine.MERCREDI, JourSemaine.JEUDI, JourSemaine.VENDREDI, JourSemaine.SAMEDI, JourSemaine.DIMANCHE];

export function mapEtablissementPublicAccompagnement(resultatRechercheEtablissementPublic: Array<EtablissementPublic>): Array<EtablissementAccompagnement> {
	const etablissementsAccompagnement: Array<EtablissementAccompagnement> = [];
	resultatRechercheEtablissementPublic.map((etablissementPublic) => {
		const { adresse, adresse_courriel, plage_ouverture, id, nom, pivot, telephone } = etablissementPublic;

		const pivotParsed: Array<PivotLocal> = JSON.parse(pivot);
		const typeEtablissement = mapTypeEtablissement(pivotParsed);
		if (!typeEtablissement) return;

		const adressesParsed: Array<AdresseParsed> = JSON.parse(adresse);
		const telephoneParsed: Array<Telephone> | undefined = telephone && JSON.parse(telephone);
		const plageOuvertureParsed: Array<PlageOuverture> = plage_ouverture && JSON.parse(plage_ouverture);

		etablissementsAccompagnement.push({
			adresse: mapAdresse(adressesParsed),
			email: adresse_courriel,
			horaires: plageOuvertureParsed && mapHoraire(plageOuvertureParsed),
			id,
			nom,
			telephone: telephoneParsed && telephoneParsed[0]?.valeur,
			type: typeEtablissement,
		});
	});
	return etablissementsAccompagnement;
}

function mapTypeEtablissement(pivotLocal: Array<PivotLocal>): TypeÉtablissement | undefined {
	const pivotLocalWithValidEtablissementType = pivotLocal.find((pivotLocal) => isTypeEtablissement(pivotLocal.type_service_local));
	return pivotLocalWithValidEtablissementType?.type_service_local as TypeÉtablissement;
}

function mapAdresse(adresseList: Array<AdresseParsed>): Adresse | undefined {
	const adresse = adresseList.find((adresse) => adresse.type_adresse === 'Adresse');
	if (!adresse) {
		return undefined;
	}

	return {
		codePostal: adresse.code_postal,
		nomCommune: adresse.nom_commune,
		numeroVoie: adresse.numero_voie,
	};
}

function isValidPlageOuverture(plageOuverture: PlageOuverture): boolean {
	const indexDebutJour = JOURS_DE_LA_SEMAINE_NOM.indexOf(plageOuverture.nom_jour_debut);
	const indexFinJour = JOURS_DE_LA_SEMAINE_NOM.indexOf(plageOuverture.nom_jour_fin);
	return indexDebutJour !== -1 && indexFinJour !== -1;
}

function isCurrentJourInPlageOuverture(jour: JourSemaine, plageOuvertureEtablissement: PlageOuverture): boolean {
	const indexDebutJour = JOURS_DE_LA_SEMAINE_NOM.indexOf(plageOuvertureEtablissement.nom_jour_debut);
	const indexFinJour = JOURS_DE_LA_SEMAINE_NOM.indexOf(plageOuvertureEtablissement.nom_jour_fin);
	const indexJour = JOURS_DE_LA_SEMAINE_NOM.indexOf(jour);
	return indexDebutJour <= indexJour && indexJour <= indexFinJour;
}

function mapHoraire(horaireListEtablissement: Array<PlageOuverture>): Array<Horaire> {
	horaireListEtablissement = horaireListEtablissement.filter((plageOuvertureEtablissement) => isValidPlageOuverture(plageOuvertureEtablissement));

	return JOURS_DE_LA_SEMAINE_NOM.map((jour) => {
		const plageOuverture = horaireListEtablissement.find((plageOuverture) => isCurrentJourInPlageOuverture(jour, plageOuverture));

		if (!plageOuverture) return { heures: [], jour };

		return {
			heures: mapHeures(plageOuverture),
			jour,
		};
	});
}

function mapHeures(plageOuverture: PlageOuverture): Array<Heure> {
	const { valeur_heure_debut_1, valeur_heure_debut_2, valeur_heure_fin_1, valeur_heure_fin_2 } = plageOuverture;
	const heures = [];

	if (valeur_heure_debut_1 !== '' && valeur_heure_fin_1 !== '') {
		heures.push({
			début: valeur_heure_debut_1,
			fin: valeur_heure_fin_1,
		});
	}

	if (valeur_heure_debut_2 !== '' && valeur_heure_fin_2 !== '') {
		heures.push({
			début: valeur_heure_debut_2,
			fin: valeur_heure_fin_2,
		});
	}

	return heures;
}
