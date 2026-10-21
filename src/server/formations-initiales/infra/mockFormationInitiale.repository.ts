import { createFailure, createSuccess, Either } from "~/server/errors/either";
import { ErreurMetier } from "~/server/errors/erreurMetier.types";
import {
	FormationInitiale,
	FormationInitialeDetailAvecInformationsComplementaires,
	FormationInitialeDetailCMS,
	FormationInitialeFiltre,
	NOMBRE_RÉSULTATS_FORMATIONS_INITIALES_PAR_PAGE,
	ResultatRechercheFormationsInitiales,
} from "~/server/formations-initiales/domain/formationInitiale";
import { FormationInitialeRepository } from "~/server/formations-initiales/domain/formationInitiale.repository";

export class MockFormationInitialeRepository implements FormationInitialeRepository {
	async search(filtre: FormationInitialeFiltre): Promise<Either<ResultatRechercheFormationsInitiales>> {
		const motCle = filtre.motCle?.toLowerCase() || "";
		const formationsFiltrees = mockFormationsInitiales()
			.filter((formation) => formation.libelle.toLowerCase().includes(motCle));
		const debut = (filtre.page - 1) * NOMBRE_RÉSULTATS_FORMATIONS_INITIALES_PAR_PAGE;

		return createSuccess({
			formationsInitiales: formationsFiltrees.slice(debut, debut + NOMBRE_RÉSULTATS_FORMATIONS_INITIALES_PAR_PAGE),
			nombreDeResultat: formationsFiltrees.length,
		});
	}

	async getFormationInitialeDetail(id: string): Promise<Either<FormationInitialeDetailAvecInformationsComplementaires>> {
		const formation = mockFormationsInitiales().find((formation) => formation.identifiant === id);
		if (!formation) return createFailure(ErreurMetier.CONTENU_INDISPONIBLE);

		const informationsComplementaires = mockInformationsComplementaires()[id];
		if (!informationsComplementaires) return createSuccess(formation);

		return createSuccess({ ...formation, ...informationsComplementaires });
	}
}

function mockFormationsInitiales(): Array<FormationInitiale> {
	return [
		{
			duree: "2 ans",
			identifiant: "FOR.1001",
			isCertifiante: true,
			libelle: "BTS management en hôtellerie restauration option B management d'unité de production culinaire",
			niveauDeSortie: "Bac + 2",
			url_formation: "https://www.onisep.fr/http/redirection/formation/slug/FOR.1001",
		},
		{
			duree: "1 an",
			identifiant: "FOR.1002",
			isCertifiante: true,
			libelle: "Classe préparatoire Technologie et sciences industrielles (TSI), 2e année",
			niveauDeSortie: "Bac + 2",
			url_formation: "https://www.onisep.fr/http/redirection/formation/slug/FOR.1002",
		},
		{
			duree: "3 ans",
			identifiant: "FOR.1003",
			isCertifiante: true,
			libelle: "BUT informatique parcours réalisation d'applications",
			niveauDeSortie: "Bac + 3",
			url_formation: "https://www.onisep.fr/http/redirection/formation/slug/FOR.1003",
		},
		{
			duree: "2 ans",
			identifiant: "FOR.1004",
			isCertifiante: true,
			libelle: "CAP cuisine",
			niveauDeSortie: "CAP",
			url_formation: "https://www.onisep.fr/http/redirection/formation/slug/FOR.1004",
		},
		{
			duree: "1 an",
			identifiant: "FOR.1005",
			isCertifiante: false,
			libelle: "Formation complémentaire d'initiative locale boulangerie",
			niveauDeSortie: "Bac",
			url_formation: "https://www.onisep.fr/http/redirection/formation/slug/FOR.1005",
		},
	];
}

function mockInformationsComplementaires(): Record<string, FormationInitialeDetailCMS> {
	return {
		"FOR.1001": {
			attendusParcoursup: "<p>Intérêt pour les métiers de la restauration et capacité à travailler en équipe.</p>",
			conditionsAcces: "<p>Accessible après un bac général, technologique ou professionnel.</p>",
			dateDeMiseAJour: new Date("2024-05-15T09:37:44.283Z"),
			description: "<p>Le titulaire de ce BTS maîtrise les techniques culinaires propres aux différents types de restauration.</p>",
			poursuiteEtudes: "<p>Le BTS est conçu pour une insertion professionnelle, mais une poursuite en licence professionnelle est possible.</p>",
		},
		"FOR.1003": {
			conditionsAcces: "<p>Accessible après un bac général ou un bac STI2D.</p>",
			dateDeMiseAJour: new Date("2024-09-01T10:00:00.000Z"),
			description: "<p>Le BUT informatique forme des professionnels capables de concevoir et développer des applications.</p>",
		},
	};
}
