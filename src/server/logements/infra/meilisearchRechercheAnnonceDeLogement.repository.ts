import type { Meilisearch } from 'meilisearch';

import { AnnonceDeLogementIndexee } from '~/server/logements/domain/annonceDeLogementIndexee';
import { createSuccess, Either } from '~/server/errors/either';
import {
	FiltreRechercheAnnonceDeLogement,
	NOMBRE_RESULTATS_ANNONCE_DE_LOGEMENT_PAR_PAGE,
	RechercheAnnonceDeLogementRepository,
	ResultatsRechercheAnnonceDeLogement,
} from '~/server/logements/domain/rechercheAnnonceDeLogement';
import { filtrerImagesAutorisees } from '~/server/logements/infra/imagesAutorisees';
import { ErrorManagementService } from '~/server/services/error/errorManagement.service';
import { rechercherAvecFacettesDisjonctives } from '~/server/services/meilisearch/rechercheIndexee';

const ATTRIBUT_TYPE_OFFRE = 'type';
const ATTRIBUT_TYPE_BIEN = 'typeBien';
const ATTRIBUT_PRIX = 'prix';
const ATTRIBUT_SURFACE = 'surface';

export class MeilisearchRechercheAnnonceDeLogementRepository implements RechercheAnnonceDeLogementRepository {
	constructor(
		private readonly client: Meilisearch,
		private readonly indexName: string,
		private readonly hotesDesImagesAutorises: Array<string>,
		private readonly errorManagementService: ErrorManagementService,
	) {}

	async rechercher(filtre: FiltreRechercheAnnonceDeLogement): Promise<Either<ResultatsRechercheAnnonceDeLogement>> {
		try {
			const { facettes, nombreDeResultats, resultats } = await rechercherAvecFacettesDisjonctives<AnnonceDeLogementIndexee>(this.client, this.indexName, {
				facettes: [ATTRIBUT_TYPE_OFFRE, ATTRIBUT_TYPE_BIEN],
				filtres: {
					[ATTRIBUT_TYPE_OFFRE]: filtre.typesOffre,
					[ATTRIBUT_TYPE_BIEN]: filtre.typesBien,
				},
				intervalles: {
					[ATTRIBUT_PRIX]: filtre.prix,
					[ATTRIBUT_SURFACE]: filtre.surface,
				},
				// NOTE : l‘index ne cherche que dans la ville et le code postal
				motCle: filtre.ville,
				nombreDeResultatsParPage: NOMBRE_RESULTATS_ANNONCE_DE_LOGEMENT_PAR_PAGE,
				page: filtre.page,
			});

			return createSuccess({
				facettes: {
					typesBien: facettes[ATTRIBUT_TYPE_BIEN],
					typesOffre: facettes[ATTRIBUT_TYPE_OFFRE],
				},
				nombreDeResultats,
				resultats: resultats.map((annonce) => ({
					...annonce,
					imagesUrl: filtrerImagesAutorisees(annonce.imagesUrl ?? [], this.hotesDesImagesAutorises),
				})),
			});
		} catch (error) {
			return this.errorManagementService.handleFailureError(error, {
				apiSource: 'Meilisearch',
				contexte: 'rechercher annonces de logement',
				message: 'impossible d’effectuer une recherche d’annonces de logement',
			});
		}
	}
}
