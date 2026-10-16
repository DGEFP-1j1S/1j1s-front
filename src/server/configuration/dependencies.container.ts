import {
	ActualitesDependencies,
	actualitesDependenciesContainer,
} from '~/server/actualites/configuration/dependencies.container';
import { StrapiActualitesRepository } from '~/server/actualites/infra/strapiActualites.repository';
import {
	AlternanceDependencies,
	alternancesDependenciesContainer,
} from '~/server/alternances/configuration/dependencies.container';
import { getApiAlternanceConfig } from '~/server/alternances/infra/repositories/apiAlternance/apiAlternance.config';
import {
	ApiAlternanceRepository,
} from '~/server/alternances/infra/repositories/apiAlternance/apiAlternance.repository';
import { MockAlternanceRepository } from '~/server/alternances/infra/repositories/mockAlternance.repository';
import {
	ArticleDependencies,
	articleDependenciesContainer,
} from '~/server/articles/configuration/dependencies.container';
import { StrapiArticleRepository } from '~/server/articles/infra/strapiArticle.repository';
import {
	CampagneApprentissageDependencies,
	campagneApprentissageDependenciesContainer,
} from '~/server/campagne-apprentissage/configuration/dependencies.container';
import {
	StrapiVideoCampagneApprentissageRepository,
} from '~/server/campagne-apprentissage/infra/strapiVideoCampagneApprentissage.repository';
import { CmsDependencies, cmsDependenciesContainer } from '~/server/cms/configuration/dependencies.container';
import { getApiStrapiConfig, getAuthApiStrapiConfig } from '~/server/cms/configuration/strapi/strapiHttpClient.config';
import { StrapiService } from '~/server/cms/infra/repositories/strapi.service';
import { StrapiErrorManagementService } from '~/server/cms/infra/repositories/strapiErrorManagement.service';
import {
	DemandeDeContactDependencies,
	demandeDeContactDependenciesContainer,
} from '~/server/demande-de-contact/configuration/dependencies.container';
import {
	DemandeDeContactAccompagnementRepository,
} from '~/server/demande-de-contact/infra/repositories/accompagnement/demandeDeContactAccompagnement.repository';
import {
	DemandeDeContactCEJRepository,
} from '~/server/demande-de-contact/infra/repositories/cej/demandeDeContactCEJ.repository';
import {
	OffresEmploiDependencies,
	offresEmploiDependenciesContainer,
} from '~/server/emplois/configuration/dependencies.container';
import { ApiFranceTravailOffreRepository } from '~/server/emplois/infra/repositories/apiFranceTravailOffre.repository';
import {
	getApiEuresPublicHttpClientConfig,
} from '~/server/emplois-europe/configuration/apiEures/apiEuresPublicHttpClient.config';
import {
	EmploiEuropeDependencies,
	emploiEuropeDependenciesContainer,
} from '~/server/emplois-europe/configuration/dependencies.container';
import { ApiEuresEmploiEuropeMapper } from '~/server/emplois-europe/infra/repositories/apiEuresEmploiEurope.mapper';
import {
	ApiEuresEmploiEuropeRepository,
} from '~/server/emplois-europe/infra/repositories/apiEuresEmploiEurope.repository';
import { MockEmploiEuropeRepository } from '~/server/emplois-europe/infra/repositories/mockEmploiEurope.repository';
import {
	getApiEngagementConfig,
} from '~/server/engagement/configuration/api-engagement/apiEngagementHttpClient.config';
import {
	EngagementDependencies,
	engagementDependenciesContainer,
} from '~/server/engagement/configuration/dependencies.container';
import { ApiEngagementRepository } from '~/server/engagement/infra/repositories/apiEngagement.repository';
import {
	EtablissementAccompagnementDependencies,
	etablissementAccompagnementDependenciesContainer,
} from '~/server/etablissement-accompagnement/configuration/dependencies.container';
import {
	getApiEtablissementPublicConfig,
} from '~/server/etablissement-accompagnement/configuration/etablissementPublic/etablissementPublicHttpClient.config';
import {
	ApiEtablissementPublicRepository,
} from '~/server/etablissement-accompagnement/infra/apiEtablissementPublic.repository';
import { FAQDependencies, FAQDependenciesContainer } from '~/server/faq/configuration/dependencies.container';
import { StrapiFAQRepository } from '~/server/faq/infra/strapiFAQ.repository';
import {
	FicheMetierDependencies,
	ficheMetierDependenciesContainer,
} from '~/server/fiche-metier/configuration/dependencies.container';
import { StrapiFicheMetierRepository } from '~/server/fiche-metier/infra/strapiFicheMetier.repository';
import {
	getApiLaBonneAlternanceConfig,
} from '~/server/formations/configuration/api-la-bonne-alternance/apiLaBonneAlternanceHttpClient.config';
import {
	getApiTrajectoiresProConfig,
} from '~/server/formations/configuration/api-trajectoires-pro/apiTrajectoiresProHttpClient.config';
import {
	FormationDependencies,
	formationsDependenciesContainer,
} from '~/server/formations/configuration/dependencies.container';
import {
	ApiLaBonneAlternanceFormationRepository,
} from '~/server/formations/infra/repositories/apiLaBonneAlternanceFormation.repository';
import {
	ApiTrajectoiresProStatistiqueRepository,
} from '~/server/formations/infra/repositories/apiTrajectoiresProStatistique.repository';
import {
	ApiTrajectoiresProStatistiqueErrorManagementService,
} from '~/server/formations/infra/repositories/apiTrajectoiresProStatistiqueErrorManagementService';
import {
	FormationInitialeDependencies,
	formationInitialeDependenciesContainer,
} from '~/server/formations-initiales/configuration/dependencies.container';
import {
	getApiOnisepAuthenticatedConfig,
} from '~/server/formations-initiales/configuration/httpClient/apiOnisepAuthenticatedHttpClient.config';
import {
	getApiOnisepPublicConfig,
} from '~/server/formations-initiales/configuration/httpClient/apiOnisepPublicHttpClient.config';
import {
	OnisepFormationInitialeRepository,
} from '~/server/formations-initiales/infra/onisepFormationInitiale.repository';
import {
	jobsEteDependenciesContainer,
	OffresJobEteDependencies,
} from '~/server/jobs-ete/configuration/dependencies.container';
import {
	ApiFranceTravailJobEteRepository,
} from '~/server/jobs-ete/infra/repositories/apiFranceTravailJobEte.repository';
import {
	jobsÉtudiantsDependenciesContainer,
	OffresJobÉtudiantDependencies,
} from '~/server/jobs-étudiants/configuration/dependencies.container';
import {
	ApiFranceTravailJobEtudiantRepository,
} from '~/server/jobs-étudiants/infra/repositories/apiFranceTravailJobEtudiant.repository';
import { getApiAdresseConfig } from '~/server/localisations/configuration/adresse/adresseHttpClient.config';
import {
	LocalisationDependencies,
	localisationDependenciesContainer,
} from '~/server/localisations/configuration/dependencies.container';
import { getApiGeoGouvConfig } from '~/server/localisations/configuration/geo/geoHttpClient.config';
import { ApiAdresseRepository } from '~/server/localisations/infra/repositories/apiAdresse.repository';
import {
	ApiAdresseErrorManagementService,
} from '~/server/localisations/infra/repositories/apiAdresseErrorManagement.service';
import { ApiGeoRepository } from '~/server/localisations/infra/repositories/apiGeo.repository';
import { ApiGeoErrorManagementService } from '~/server/localisations/infra/repositories/apiGeoErrorManagement.service';
import {
	AnnonceDeLogementDependencies,
	annonceDeLogementDependenciesContainer,
} from '~/server/logements/configuration/dependencies.container';
import { StrapiAnnonceDeLogementRepository } from '~/server/logements/infra/strapiAnnonceDeLogement.repository';
import { getApiTipimailConfig } from '~/server/mail/configuration/tipimail/tipimailHttpClient.config';
import { TipimailRepository } from '~/server/mail/infra/repositories/tipimail.repository';
import {
	MentionObligatoireDependencies,
	mentionObligatoireDependenciesContainer,
} from '~/server/mentions-obligatoires/configuration/dependencies.container';
import {
	StrapiMentionObligatoireRepository,
} from '~/server/mentions-obligatoires/infra/strapiMentionObligatoire.repository';
import {
	MesuresEmployeursDependencies,
	mesuresEmployeursDependenciesContainer,
} from '~/server/mesures-employeurs/configuration/dependencies.container';
import {
	StrapiMesuresEmployeursRepository,
} from '~/server/mesures-employeurs/infra/strapiMesuresEmployeurs.repository';
import {
	MétierDependencies,
	métiersDependenciesContainer,
} from '~/server/metiers/configuration/dependencies.container';
import { ApiLaBonneAlternanceMétierRepository } from '~/server/metiers/infra/apiLaBonneAlternanceMétier.repository';
import {
	getApiFranceTravailOffresConfig,
	getApiFranceTravailReferentielsConfig,
} from '~/server/offres/configuration/france-travail/franceTravailHttpClient.config';
import {
	ApiFranceTravailOffreErrorManagementServiceGet,
	ApiFranceTravailOffreErrorManagementServiceSearch,
} from '~/server/offres/infra/repositories/france-travail/apiFranceTravailErrorManagement.service';
import {
	ApiFranceTravailReferentielRepository,
} from '~/server/offres/infra/repositories/france-travail/apiFranceTravailReferentiel.repository';
import {
	FranceTravailParametreBuilderService,
} from '~/server/offres/infra/repositories/france-travail/franceTravailParametreBuilder.service';
import { MockOffreRepository } from '~/server/offres/infra/repositories/mockOffre.repository';
import { RobotsDependencies, robotsDependenciesContainer } from '~/server/robots/configuration/dependencies.container';
import { CacheService } from '~/server/services/cache/cache.service';
import { NullCacheService } from '~/server/services/cache/nullCache.service';
import { RedisCacheService } from '~/server/services/cache/redisCache.service';
import { DefaultErrorManagementService } from '~/server/services/error/errorManagement.service';
import { AuthenticatedHttpClientService } from '~/server/services/http/authenticatedHttpClient.service';
import { CachedHttpClientService } from '~/server/services/http/cachedHttpClient.service';
import { PublicHttpClientService } from '~/server/services/http/publicHttpClient.service';
import { LoggerService } from '~/server/services/logger.service';
import { aLoggerService } from '~/server/services/logger.service.fixture';
import { PinoLoggerService } from '~/server/services/pinoLogger.service';
import ServerConfigurationService from '~/server/services/serverConfiguration.service';
import { FastXmlParserService } from '~/server/services/xml/fastXmlParser.service';
import {
	ServicesJeunesDependencies,
	servicesJeunesDependenciesContainer,
} from '~/server/services-jeunes/configuration/dependencies.container';
import { StrapiServicesJeunesRepository } from '~/server/services-jeunes/infra/strapiServicesJeunes.repository';
import {
	SitemapDependencies,
	sitemapDependenciesContainer,
} from '~/server/sitemap/configuration/dependencies.container';
import {
	Stage3eEt2deDependencies,
	stage3eEt2deDependenciesContainer,
} from '~/server/stage-3e-et-2de/configuration/dependencies.container';
import {
	getApiImmersionFacileStage3eEt2deConfig,
} from '~/server/stage-3e-et-2de/configuration/stage-3e-et-2de/stage3eEt2deHttpClient.config';
import {
	ApiFranceTravailMetierStage3eEt2deRepository,
} from '~/server/stage-3e-et-2de/infra/repositories/apiFranceTravailMetierStage3eEt2de.repository';
import {
	ApiImmersionFacileStage3eEt2deRepository,
} from '~/server/stage-3e-et-2de/infra/repositories/apiImmersionFacileStage3eEt2de.repository';
import {
	ApiImmersionFacileStage3eEt2deErrorManagementService,
} from '~/server/stage-3e-et-2de/infra/repositories/apiImmersionFacileStage3eEt2deErrorManagement.service';
import { StagesDependencies, stagesDependenciesContainer } from '~/server/stages/configuration/dependencies.container';
import { StrapiStagesRepository } from '~/server/stages/repository/strapiStages.repository';

export type Dependencies = {
	actualitesDependencies: ActualitesDependencies;
	articleDependencies: ArticleDependencies;
	ficheMetierDependencies: FicheMetierDependencies;
	faqDependencies: FAQDependencies;
	stagesDependencies: StagesDependencies;
	annonceDeLogementDependencies: AnnonceDeLogementDependencies;
	alternanceDependencies: AlternanceDependencies;
	formationDependencies: FormationDependencies;
	formationInitialeDependencies: FormationInitialeDependencies;
	métierDependencies: MétierDependencies;
	offreEmploiDependencies: OffresEmploiDependencies;
	cmsDependencies: CmsDependencies;
	engagementDependencies: EngagementDependencies;
	localisationDependencies: LocalisationDependencies;
	demandeDeContactDependencies: DemandeDeContactDependencies;
	offreJobEteDependencies: OffresJobEteDependencies;
	offreJobÉtudiantDependencies: OffresJobÉtudiantDependencies
	robotsDependencies: RobotsDependencies;
	sitemapDependencies: SitemapDependencies;
	établissementAccompagnementDependencies: EtablissementAccompagnementDependencies;
	servicesJeunesDependencies: ServicesJeunesDependencies;
	mesuresEmployeursDependencies: MesuresEmployeursDependencies
	mentionObligatoireDependencies: MentionObligatoireDependencies;
	loggerService: LoggerService
	emploiEuropeDependencies: EmploiEuropeDependencies;
	stage3eEt2deDependencies: Stage3eEt2deDependencies;
	campagneApprentissageDependencies: CampagneApprentissageDependencies;
}

export function dependenciesContainer(): Dependencies {
	const serverConfigurationService = new ServerConfigurationService();
	let cacheService: CacheService;
	let loggerService: LoggerService;

	if (process.env.NODE_ENV === 'test') {
		loggerService = aLoggerService();
	} else {
		loggerService = new PinoLoggerService(
			serverConfigurationService.getConfiguration().NEXT_PUBLIC_SENTRY_DSN,
			serverConfigurationService.getConfiguration().NEXT_PUBLIC_SENTRY_LOG_LEVEL,
			serverConfigurationService.getConfiguration().NEXT_PUBLIC_SENTRY_ENVIRONMENT,
		);
	}

	if (serverConfigurationService.getConfiguration().REDIS_URL !== '') {
		const redisUrl = serverConfigurationService.getConfiguration().REDIS_URL;
		cacheService = new RedisCacheService(redisUrl, loggerService);
	} else {
		cacheService = new NullCacheService();
	}

	const defaultErrorManagementService = new DefaultErrorManagementService(loggerService);

	const strapiAuthenticatedHttpClientService = new AuthenticatedHttpClientService(getAuthApiStrapiConfig(serverConfigurationService), loggerService);
	const strapiPublicHttpClientService = new PublicHttpClientService(getApiStrapiConfig(serverConfigurationService));
	const strapiErrorManagementService = new StrapiErrorManagementService(loggerService);
	const cmsService = new StrapiService(strapiPublicHttpClientService, strapiAuthenticatedHttpClientService, strapiErrorManagementService);
	const cmsDependencies = cmsDependenciesContainer(serverConfigurationService);


	const franceTravailReferentielsHttpClientService = new AuthenticatedHttpClientService(getApiFranceTravailReferentielsConfig(serverConfigurationService), loggerService);
	const franceTravailOffresHttpClientService = new AuthenticatedHttpClientService(getApiFranceTravailOffresConfig(serverConfigurationService), loggerService);
	const apiFranceTravailReferentielRepository = new ApiFranceTravailReferentielRepository(franceTravailReferentielsHttpClientService, cacheService);
	const franceTravailParametreBuilderService = new FranceTravailParametreBuilderService(apiFranceTravailReferentielRepository);
	const apiFranceTravailOffreErrorManagementServiceSearch = new ApiFranceTravailOffreErrorManagementServiceSearch(loggerService);
	const apiFranceTravailOffreErrorManagementServiceGet = new ApiFranceTravailOffreErrorManagementServiceGet(loggerService);
	const apiFranceTravailOffreRepository = new ApiFranceTravailOffreRepository(franceTravailOffresHttpClientService, franceTravailParametreBuilderService, cacheService, apiFranceTravailOffreErrorManagementServiceSearch, apiFranceTravailOffreErrorManagementServiceGet);
	const offreEmploiDependencies = serverConfigurationService.getConfiguration().API_FRANCE_TRAVAIL_IS_MOCK_ACTIVE
		? offresEmploiDependenciesContainer(new MockOffreRepository())
		: offresEmploiDependenciesContainer(apiFranceTravailOffreRepository);

	const apiFranceTravailJobEtudiantRepository = new ApiFranceTravailJobEtudiantRepository(franceTravailOffresHttpClientService, franceTravailParametreBuilderService, cacheService, apiFranceTravailOffreErrorManagementServiceSearch, apiFranceTravailOffreErrorManagementServiceGet);
	const offreJobÉtudiantDependencies = serverConfigurationService.getConfiguration().API_FRANCE_TRAVAIL_IS_MOCK_ACTIVE
		? jobsÉtudiantsDependenciesContainer(new MockOffreRepository())
		: jobsÉtudiantsDependenciesContainer(apiFranceTravailJobEtudiantRepository);

	const apiFranceTravailJobEteRepository = new ApiFranceTravailJobEteRepository(franceTravailOffresHttpClientService, franceTravailParametreBuilderService, cacheService, apiFranceTravailOffreErrorManagementServiceSearch, apiFranceTravailOffreErrorManagementServiceGet);
	const offreJobEteDependencies = serverConfigurationService.getConfiguration().API_FRANCE_TRAVAIL_IS_MOCK_ACTIVE
		? jobsEteDependenciesContainer(new MockOffreRepository())
		: jobsEteDependenciesContainer(apiFranceTravailJobEteRepository);

	const laBonneAlternanceClientService = new PublicHttpClientService(getApiLaBonneAlternanceConfig(serverConfigurationService));
	const apiLaBonneAlternanceCaller = serverConfigurationService.getConfiguration().API_LA_BONNE_ALTERNANCE_CALLER;
	const apiLaBonneAlternanceFormationRepository = new ApiLaBonneAlternanceFormationRepository(laBonneAlternanceClientService, apiLaBonneAlternanceCaller, defaultErrorManagementService);
	const apiLaBonneAlternanceMétierRepository = new ApiLaBonneAlternanceMétierRepository(laBonneAlternanceClientService, defaultErrorManagementService);
	const apiAlternanceClient = new AuthenticatedHttpClientService(getApiAlternanceConfig(serverConfigurationService), loggerService);
	const apiAlternanceRepository = new ApiAlternanceRepository(apiAlternanceClient, new DefaultErrorManagementService(loggerService));

	const alternanceDependencies = serverConfigurationService.getConfiguration().API_LA_BONNE_ALTERNANCE_IS_ALTERNANCE_MOCK_ACTIVE // todo devrait se baser sur si c'est environnement de test non ?
	  ? alternancesDependenciesContainer(new MockAlternanceRepository())
		: alternancesDependenciesContainer(apiAlternanceRepository);

	const trajectoiresProHttpClientService = new AuthenticatedHttpClientService(getApiTrajectoiresProConfig(serverConfigurationService), loggerService);
	const geoHttpClientService = new CachedHttpClientService(getApiGeoGouvConfig(serverConfigurationService));
	const apiGeoErrorManagementService = new ApiGeoErrorManagementService(loggerService);
	const apiGeoLocalisationRepository = new ApiGeoRepository(geoHttpClientService, apiGeoErrorManagementService);
	const apiTrajectoiresProStatistiqueErrorManagementService = new ApiTrajectoiresProStatistiqueErrorManagementService(loggerService);
	const apiTrajectoiresProStatistiqueRepository = new ApiTrajectoiresProStatistiqueRepository(trajectoiresProHttpClientService, apiGeoLocalisationRepository, apiTrajectoiresProStatistiqueErrorManagementService);

	const formationDependencies = formationsDependenciesContainer(apiLaBonneAlternanceFormationRepository, apiTrajectoiresProStatistiqueRepository);

	const métierDependencies = métiersDependenciesContainer(apiLaBonneAlternanceMétierRepository);

	const isProd = serverConfigurationService.getConfiguration().ENVIRONMENT === 'production';

	const apiOnisepHttpClient = isProd
		? new AuthenticatedHttpClientService(getApiOnisepAuthenticatedConfig(serverConfigurationService), loggerService)
		: new PublicHttpClientService(getApiOnisepPublicConfig(serverConfigurationService));
	const onisepFormationInitialeRepository = new OnisepFormationInitialeRepository(apiOnisepHttpClient, defaultErrorManagementService, cmsService);
	const formationInitialeDependencies = formationInitialeDependenciesContainer(onisepFormationInitialeRepository);


	const engagementHttpClientService = new PublicHttpClientService(getApiEngagementConfig(serverConfigurationService));
	const apiEngagementRepository = new ApiEngagementRepository(engagementHttpClientService, defaultErrorManagementService);
	const engagementDependencies = engagementDependenciesContainer(apiEngagementRepository);

	const apiAdresseErrorManagementService = new ApiAdresseErrorManagementService(loggerService);
	const adresseHttpClientService = new CachedHttpClientService(getApiAdresseConfig(serverConfigurationService));
	const apiAdresseRepository = new ApiAdresseRepository(adresseHttpClientService, apiAdresseErrorManagementService);
	const localisationDependencies = localisationDependenciesContainer(apiGeoLocalisationRepository, apiAdresseRepository, serverConfigurationService);

	const mailClientService = new PublicHttpClientService(getApiTipimailConfig(serverConfigurationService));
	const mailRepository = new TipimailRepository(
		mailClientService,
		defaultErrorManagementService,
		serverConfigurationService.getConfiguration().MAILER_SERVICE_ACTIVE === '1',
		serverConfigurationService.getConfiguration().MAILER_SERVICE_REDIRECT_TO || undefined,
	);
	const demandeDeContactAccompagnementRepository = new DemandeDeContactAccompagnementRepository(mailRepository);
	const demandeDeContactCEJRepository = new DemandeDeContactCEJRepository(cmsService);

	const demandeDeContactDependencies = demandeDeContactDependenciesContainer(
		demandeDeContactAccompagnementRepository,
		demandeDeContactCEJRepository,
	);

	const etablissementPublicHttpClientService = new PublicHttpClientService(getApiEtablissementPublicConfig(serverConfigurationService));
	const apiEtablissementPublicRepository = new ApiEtablissementPublicRepository(etablissementPublicHttpClientService, defaultErrorManagementService);
	const établissementAccompagnementDependencies = etablissementAccompagnementDependenciesContainer(apiEtablissementPublicRepository);

	const ficheMetierRepository = new StrapiFicheMetierRepository(cmsService);
	const ficheMetierDependencies = ficheMetierDependenciesContainer(ficheMetierRepository);

	const faqRepository = new StrapiFAQRepository(cmsService);
	const faqDependencies = FAQDependenciesContainer(faqRepository);

	const annonceDeLogementRepository = new StrapiAnnonceDeLogementRepository(cmsService, defaultErrorManagementService);
	const annonceDeLogementDependencies = annonceDeLogementDependenciesContainer(annonceDeLogementRepository);

	const stagesRepository = new StrapiStagesRepository(cmsService, defaultErrorManagementService);
	const stagesDependencies = stagesDependenciesContainer(stagesRepository);

	const videoCampagneApprentissageRepository = new StrapiVideoCampagneApprentissageRepository(cmsService, defaultErrorManagementService);
	const campagneApprentissageDependencies = campagneApprentissageDependenciesContainer(videoCampagneApprentissageRepository);

	const actualitesRepository = new StrapiActualitesRepository(cmsService, defaultErrorManagementService);
	const actualitesDependencies = actualitesDependenciesContainer(actualitesRepository);

	const articleRepository = new StrapiArticleRepository(cmsService, defaultErrorManagementService);
	const articleDependencies = articleDependenciesContainer(articleRepository);

	const servicesJeunesRepository = new StrapiServicesJeunesRepository(cmsService, defaultErrorManagementService);
	const servicesJeunesDependencies = servicesJeunesDependenciesContainer(servicesJeunesRepository);

	const mesuresEmployeursRepository= new StrapiMesuresEmployeursRepository(cmsService, defaultErrorManagementService);
	const mesuresEmployeursDependencies = mesuresEmployeursDependenciesContainer(mesuresEmployeursRepository);

	const mentionObligatoireRepository = new StrapiMentionObligatoireRepository(cmsService);
	const mentionObligatoireDependencies = mentionObligatoireDependenciesContainer(mentionObligatoireRepository);

	const robotsDependencies = robotsDependenciesContainer(serverConfigurationService);

	const baseUrl = `https://${serverConfigurationService.getConfiguration().NEXT_PUBLIC_1J1S_DOMAIN}`;
	const sitemapDependencies = sitemapDependenciesContainer(ficheMetierRepository, faqRepository, annonceDeLogementRepository, stagesRepository, articleRepository, baseUrl);

	const apiEuresHttpClientService = new PublicHttpClientService(getApiEuresPublicHttpClientConfig(serverConfigurationService));
	const apiEuresXmlService = new FastXmlParserService();
	const apiEuresEmploiEuropeMapper = new ApiEuresEmploiEuropeMapper(apiEuresXmlService);
	const apiEuresEmploiEuropeRepository = new ApiEuresEmploiEuropeRepository(apiEuresHttpClientService, defaultErrorManagementService, apiEuresEmploiEuropeMapper);

	const emploiEuropeDependencies = serverConfigurationService.getConfiguration().API_EURES_IS_MOCK_ACTIVE
		? emploiEuropeDependenciesContainer(new MockEmploiEuropeRepository(apiEuresEmploiEuropeMapper))
		: emploiEuropeDependenciesContainer(apiEuresEmploiEuropeRepository);

	const stage3eEt2deHttpClientService = new PublicHttpClientService(getApiImmersionFacileStage3eEt2deConfig(serverConfigurationService));
	const apiImmersionFacileStage3eEt2deErrorManagementService = new ApiImmersionFacileStage3eEt2deErrorManagementService(loggerService);
	const apiImmersionFacileStage3eEt2deRepository = new ApiImmersionFacileStage3eEt2deRepository(
		stage3eEt2deHttpClientService,
		apiImmersionFacileStage3eEt2deErrorManagementService,
	);
	const apiFranceTravailMetierStage3eEt2deRepository = new ApiFranceTravailMetierStage3eEt2deRepository(franceTravailReferentielsHttpClientService, cacheService, defaultErrorManagementService);
	const stage3eEt2deDependencies = stage3eEt2deDependenciesContainer(apiImmersionFacileStage3eEt2deRepository, apiFranceTravailMetierStage3eEt2deRepository);

	return {
		actualitesDependencies,
		alternanceDependencies,
		annonceDeLogementDependencies,
		articleDependencies,
		campagneApprentissageDependencies,
		cmsDependencies,
		demandeDeContactDependencies,
		emploiEuropeDependencies,
		engagementDependencies,
		faqDependencies,
		ficheMetierDependencies,
		formationDependencies,
		formationInitialeDependencies,
		localisationDependencies,
		loggerService,
		mentionObligatoireDependencies,
		mesuresEmployeursDependencies,
		métierDependencies,
		offreEmploiDependencies,
		offreJobEteDependencies,
		offreJobÉtudiantDependencies,
		robotsDependencies,
		servicesJeunesDependencies,
		sitemapDependencies,
		stage3eEt2deDependencies,
		stagesDependencies,
		établissementAccompagnementDependencies,
	};
}
