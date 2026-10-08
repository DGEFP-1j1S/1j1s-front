import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { CompositionClient, SearchClient } from 'algoliasearch-helper/types/algoliasearch';

import { EvenementAnalyticsService, ManualAnalyticsService } from '~/client/services/analytics/analytics.service';
import { EulerianAnalyticsService } from '~/client/services/analytics/eulerian/eulerian.analytics.service';
import { MatomoAnalyticsService } from '~/client/services/analytics/matomo/matomo.analytics.service';
import {
	MatomoTagManagerAnalyticsService,
} from '~/client/services/analytics/matomoTagManager/matomoTagManager.analytics.service';
import { NullEvenementAnalyticsService } from "~/client/services/analytics/null/null.evenementAnalytics.service";
import { BffHttpClientService } from '~/client/services/bff.httpClient.service';
import { CookiesService } from '~/client/services/cookies/cookies.service';
import { NullCookiesService } from '~/client/services/cookies/null/null.cookies.service';
import { TarteAuCitronCookiesService } from '~/client/services/cookies/tarteaucitron/tarteAuCitron.cookies.service';
import { DateService } from '~/client/services/date/date.service';
import { JsDateService } from '~/client/services/date/js/js.date.service';
import { BffDemandeDeContactService } from '~/client/services/demandeDeContact/bff.demandeDeContact.service';
import { DemandeDeContactService } from '~/client/services/demandeDeContact/demandeDeContact.service';
import {
	BffEtablissementAccompagnementService,
} from '~/client/services/etablissementAccompagnement/bff.etablissementAccompagnement.service';
import {
	EtablissementAccompagnementService,
} from '~/client/services/etablissementAccompagnement/etablissementAccompagnement.service';
import { BffEmploiEuropeService } from '~/client/services/europe/bff.emploiEurope.service';
import { EmploiEuropeService } from '~/client/services/europe/emploiEurope.service';
import {
	FormationInitialeInterface,
	FormationInitialeService,
} from '~/client/services/formationInitiale/formationInitiale.service';
import { BffLocalisationService } from '~/client/services/localisation/bff.localisation.service';
import { LocalisationService } from '~/client/services/localisation/localisation.service';
import { LoggerService } from '~/client/services/logger.service';
import { AdformMarketingService } from '~/client/services/marketing/adform/adform.marketing.service';
import { FloodlightMarketingService } from "~/client/services/marketing/floodlight/floodlight.marketing.service";
import { GoldenBeesMarketingService } from "~/client/services/marketing/goldenbees/goldenbees.marketing.service";
import { SeedtagMarketingService } from "~/client/services/marketing/seedtag/seedtag.marketing.service";
import { StackAdaptMarketingService } from "~/client/services/marketing/stackadapt/stackadapt.marketing.service";
import { BffAlternanceMetierService } from '~/client/services/metiers/bff.alternance.metier.service';
import { MetierService } from '~/client/services/metiers/metier.service';
import { BffMissionEngagementService } from '~/client/services/missionEngagement/bff.missionEngagement.service';
import { MissionEngagementService } from '~/client/services/missionEngagement/missionEngagement.service';
import { BffStageService } from '~/client/services/stage/bff.stage.service';
import { StageService } from '~/client/services/stage/stage.service';
import { BffStage3eEt2deService } from '~/client/services/stage3eEt2de/bff.stage3eEt2de.service';
import { BffStage3eEt2deMetierService } from '~/client/services/stage3eEt2de/metier/bff.stage3eEt2deMetier.service';
import { Stage3eEt2deService } from '~/client/services/stage3eEt2de/stage3eEt2de.service';
import {
	LocalStorageStageDeposerOffreEtape1PersistenceService,
} from '~/client/services/stageDeposerOffreEtape1Persistence/localStorageStageDeposerOffreEtape1Persistence.service';
import {
	StageDeposerOffreEtape1PersistenceService,
} from '~/client/services/stageDeposerOffreEtape1Persistence/stageDeposerOffreEtape1Persistence.service';
import {
	SessionStorageStageDeposerOffreEtape2PersistenceService,
} from '~/client/services/stageDeposerOffreEtape2Persistence/sessionStorageStageDeposerOffreEtape2Persistence.service';
import {
	StageDeposerOffreEtape2PersistenceService,
} from '~/client/services/stageDeposerOffreEtape2Persistence/stageDeposerOffreEtape2Persistence.service';
import {
	LocalStorageStageDeposerOffreEtape3PersistenceService,
} from '~/client/services/stageDeposerOffreEtape3Persistence/localStorageStageDeposerOffreEtape3Persistence.service';
import {
	StageDeposerOffreEtape3PersistenceService,
} from '~/client/services/stageDeposerOffreEtape3Persistence/stageDeposerOffreEtape3Persistence.service';
import { BrowserStorageService } from '~/client/services/storage/browser.storage.service';
import { getStorageServiceWithFallback } from '~/client/services/storage/getStorageServiceWithFallback';
import { NullStorageService } from '~/client/services/storage/null.storage.service';
import { StorageService } from '~/client/services/storage/storage.service';
import { VideoService } from '~/client/services/video/video.service';
import { YoutubeVideoService } from '~/client/services/video/youtube/youtube.video.service';

export type RechercheClientService = SearchClient | CompositionClient;

export type Dependency = Dependencies[keyof Dependencies];
export type Dependencies = {
	cookiesService: CookiesService
	analyticsService: ManualAnalyticsService
	evenementAnalyticsService: EvenementAnalyticsService
	demandeDeContactService: DemandeDeContactService
	formationInitialeService: FormationInitialeInterface
	localisationService: LocalisationService
	metierLbaService: MetierService
	metierStage3eEt2deService: MetierService
	missionEngagementService: MissionEngagementService
	rechercheClientService: RechercheClientService
	stageService: StageService
	youtubeService: VideoService
	établissementAccompagnementService: EtablissementAccompagnementService
	dateService: DateService
	emploiEuropeService: EmploiEuropeService
	stage3eEt2deService: Stage3eEt2deService
	stageDeposerOffreEtape1PersistenceService: StageDeposerOffreEtape1PersistenceService
	stageDeposerOffreEtape2PersistenceService: StageDeposerOffreEtape2PersistenceService
	stageDeposerOffreEtape3PersistenceService: StageDeposerOffreEtape3PersistenceService
	localStorageService: StorageService
	sessionStorageService: StorageService
}

class DependencyInitException extends Error {
	constructor(dependencyName: string, reason: string) {
		super(`Cannot init ${dependencyName} dependency, reason: ${reason}`);
	}
}

const getCookieService = () => {
	return process.env.NODE_ENV === 'production' && typeof window !== 'undefined' && window.tarteaucitron != undefined
		? new TarteAuCitronCookiesService(window.tarteaucitron)
		: new NullCookiesService();
};

export default function dependenciesContainer(sessionId?: string): Dependencies {
	const loggerService = new LoggerService(sessionId);
	const httpClientService = new BffHttpClientService(sessionId, loggerService);
	const metierLbaService = new BffAlternanceMetierService(httpClientService);
	const metierStage3eEt2deService = new BffStage3eEt2deMetierService(httpClientService);
	const formationInitialeService = new FormationInitialeService(httpClientService);
	const localisationService = new BffLocalisationService(httpClientService);
	const missionEngagementService = new BffMissionEngagementService(httpClientService);
	const demandeDeContactService = new BffDemandeDeContactService(httpClientService);
	const établissementAccompagnementService = new BffEtablissementAccompagnementService(httpClientService);
	const emploiEuropeService = new BffEmploiEuropeService(httpClientService);
	const stageService = new BffStageService(httpClientService);
	const cookiesService = getCookieService();
	if (process.env.NEXT_PUBLIC_CAMPAGNE_2026_10_FEATURE === "1") {
		new AdformMarketingService(cookiesService);
		new SeedtagMarketingService(cookiesService);
		new FloodlightMarketingService(cookiesService);
		new StackAdaptMarketingService(cookiesService);
		new GoldenBeesMarketingService(cookiesService);
	}

	const evenementAnalyticsService: EvenementAnalyticsService = process.env.NEXT_PUBLIC_ANALYTICS_MATOMO_FEATURE === "1"
		? new MatomoAnalyticsService(cookiesService)
		: new NullEvenementAnalyticsService();

	if (process.env.NEXT_PUBLIC_ANALYTICS_MATOMO_TAG_MANAGER_FEATURE === '1') {
		new MatomoTagManagerAnalyticsService(cookiesService);
	}

	const analyticsService = new EulerianAnalyticsService(cookiesService);

	const youtubeService = new YoutubeVideoService(cookiesService);
	const dateService = new JsDateService();

	const meiliSearchBaseUrl = process.env.NEXT_PUBLIC_STAGE_SEARCH_ENGINE_BASE_URL;
	const meiliSearchApiKey = process.env.NEXT_PUBLIC_STAGE_SEARCH_ENGINE_API_KEY;

	if (!meiliSearchApiKey || !meiliSearchBaseUrl) {
		throw new DependencyInitException(
			'rechercheClientService',
			'NEXT_PUBLIC_STAGE_SEARCH_ENGINE_BASE_URL or NEXT_PUBLIC_STAGE_SEARCH_ENGINE_API_KEY environment variable is missing',
		);
	}
	const instantMeiliSearchObject  = instantMeiliSearch(
		meiliSearchBaseUrl,
		meiliSearchApiKey,
		{
			keepZeroFacets: true,
			primaryKey: 'slug',
		},
	);
	const rechercheClientService = instantMeiliSearchObject.searchClient;

	const stage3eEt2deService = new BffStage3eEt2deService(httpClientService);

	const localStorageService = new BrowserStorageService(() => window.localStorage);
	const sessionStorageService = new BrowserStorageService(() => window.sessionStorage);
	const stageDeposerOffreEtape1PersistenceService = new LocalStorageStageDeposerOffreEtape1PersistenceService(
		getStorageServiceWithFallback(localStorageService, new NullStorageService()));
	const stageDeposerOffreEtape2PersistenceService = new SessionStorageStageDeposerOffreEtape2PersistenceService(
		getStorageServiceWithFallback(sessionStorageService, new NullStorageService()));
	const stageDeposerOffreEtape3PersistenceService = new LocalStorageStageDeposerOffreEtape3PersistenceService(
		getStorageServiceWithFallback(localStorageService, new NullStorageService()));

	return {
		analyticsService,
		cookiesService,
		dateService,
		demandeDeContactService,
		emploiEuropeService,
		evenementAnalyticsService,
		formationInitialeService,
		localStorageService,
		localisationService,
		metierLbaService,
		metierStage3eEt2deService,
		missionEngagementService,
		rechercheClientService,
		sessionStorageService,
		stage3eEt2deService,
		stageDeposerOffreEtape1PersistenceService,
		stageDeposerOffreEtape2PersistenceService,
		stageDeposerOffreEtape3PersistenceService,
		stageService,
		youtubeService,
		établissementAccompagnementService,
	};
}
