import {
	Mission,
	MissionEngagementRechercheBenevolat,
	MissionEngagementRechercheServiceCivique,
	MissionId,
	RésultatsRechercheMission,
} from '~/server/engagement/domain/engagement';
import { EngagementRepository } from '~/server/engagement/domain/engagement.repository';
import { buildParamètresRechercheApiEngagement } from '~/server/engagement/infra/repositories/apiEngagement.builder';
import { mapMission, mapRésultatsRechercheMission } from '~/server/engagement/infra/repositories/apiEngagement.mapper';
import {
	RésultatsMissionEngagementResponse,
	RésultatsRechercheMissionEngagementResponse,
} from '~/server/engagement/infra/repositories/apiEngagement.response';
import { createFailure, createSuccess, Either } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { ErrorManagementService } from '~/server/services/error/errorManagement.service';
import { PublicHttpClientService } from '~/server/services/http/publicHttpClient.service';

const JE_VEUX_AIDER_PUBLISHER_ID = '5f5931496c7ea514150a818f';
const SERVICE_CIVIQUE_PUBLISHER_ID = '5f99dbe75eb1ad767733b206';

// L’API Engagement identifie ses missions par un ObjectId MongoDB (24 caractères hexadécimaux).
// Tout id d’un autre format (ex : UUID de vieilles URL indexées) ne peut correspondre à aucune
// mission : on court-circuite pour ne pas polluer l’API partenaire avec des requêtes vouées au 404.
const FORMAT_ID_MISSION_ENGAGEMENT = /^[a-f\d]{24}$/i;

export class ApiEngagementRepository implements EngagementRepository {
	constructor(private readonly httpClientService: PublicHttpClientService, private readonly errorManagementService: ErrorManagementService) {}

	async getMissionEngagement(id: MissionId): Promise<Either<Mission>> {
		if (!FORMAT_ID_MISSION_ENGAGEMENT.test(id)) {
			return createFailure(ErreurMetier.CONTENU_INDISPONIBLE);
		}
		try {
			const response = await this.httpClientService.get<RésultatsMissionEngagementResponse>(
				`mission/${id}`,
			);
			return createSuccess(mapMission(response.data));
		} catch (e) {
			return this.errorManagementService.handleFailureError(e, {
				apiSource: 'API Engagement',
				contexte: 'get détail mission d’engagement',
				message: 'impossible de récupérer le détail d’une mission',
			});
		}
	}

	private async searchMissionEngagement(query: string) {
		try {
			const response = await this.httpClientService.get<RésultatsRechercheMissionEngagementResponse>(
				`mission/search?${query}`,
			);
			return createSuccess(mapRésultatsRechercheMission(response.data));
		} catch (e) {
			return this.errorManagementService.handleFailureError(e, {
				apiSource: 'API Engagement',
				contexte: 'search mission d’engagement',
				message: 'impossible d’effectuer une recherche de mission d’engagement',
			});
		}
	}

	async searchMissionServiceCivique(missionEngagementFiltre: MissionEngagementRechercheServiceCivique): Promise<Either<RésultatsRechercheMission>> {
		const paramètresRecherche = buildParamètresRechercheApiEngagement(missionEngagementFiltre, SERVICE_CIVIQUE_PUBLISHER_ID);
		return this.searchMissionEngagement(paramètresRecherche);
	}

	async searchMissionBénévolat(missionEngagementFiltre: MissionEngagementRechercheBenevolat): Promise<Either<RésultatsRechercheMission>> {
		const paramètresRecherche = buildParamètresRechercheApiEngagement(missionEngagementFiltre, JE_VEUX_AIDER_PUBLISHER_ID);
		return this.searchMissionEngagement(paramètresRecherche);
	}
}
