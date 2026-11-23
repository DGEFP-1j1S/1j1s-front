import {
	isNavigationItem,
	NavigationItem,
	NavigationItemList,
	NavigationItemWithChildren,
} from '~/client/components/layouts/Header/Navigation/NavigationStructure';
import { ArticleRepository } from '~/server/articles/domain/articles.repository';
import { Either, isSuccess } from '~/server/errors/either';
import { FAQRepository } from '~/server/faq/domain/FAQ.repository';
import { FicheMetierRepository } from '~/server/fiche-metier/domain/ficheMetier.repository';
import { AnnonceDeLogementRepository } from '~/server/logements/domain/annonceDeLogement.repository';
import { StagesRepository } from '~/server/stages/domain/stages.repository';
import isInternalURL from '~/shared/isInternalURL';

const DÉCOUVRIR_LES_METIERS_ROOT_PATH = 'decouvrir-les-metiers';
const ARTICLE_ROOT_PATH = 'articles';
const FAQ_ROOT_PATH = 'faq';
const ANNONCE_DE_LOGEMENT_ROOT_PATH = 'logements/annonces';
const STAGE_ROOT_PATH = 'stages';
const FOOTER_STATIC_PATH_LIST = [
	'/faq',
	'/plan-du-site',
	'/cgu',
	'/accessibilite',
	'/mentions-legales',
	'/confidentialite',
];
const OTHER_STATIC_PATH_LIST = [
	'/les-entreprises-s-engagent/inscription',
	'/stages/deposer-offre',
	'/emplois/deposer-offre',
	'/espace-jeune',
];

export class GenererSitemapUseCase {
	constructor(private ficheMetierRepository: FicheMetierRepository,
		private faqRepository: FAQRepository,
		private annonceDeLogementRepository: AnnonceDeLogementRepository,
		private stagesRepository: StagesRepository,
		private articlesRepository: ArticleRepository,
		private navigationList: NavigationItemList,
		private baseUrl: string) {
	}

	async handle(): Promise<string> {
		const staticPathList = this.flattenNavigationItemList(Object.values(this.navigationList));
		staticPathList.push(...FOOTER_STATIC_PATH_LIST);
		staticPathList.push(...OTHER_STATIC_PATH_LIST);

		const [ficheMetierNomMetierListResult, articleSlugListResult, faqSlugListResult, offreDeStageSlugListResult, annonceDeLogementSlugListResult] = await Promise.all([
			this.ficheMetierRepository.getAllNomsMetiers(),
			this.articlesRepository.listAllArticleSlug(),
			this.faqRepository.listAllFAQSlug(),
			this.stagesRepository.listAllOffreDeStageSlug(),
			this.annonceDeLogementRepository.listAllAnnonceDeLogementSlug(),
		]);
		const dynamicPathList = [
			...this.mapDynamicPathListResult(ficheMetierNomMetierListResult, DÉCOUVRIR_LES_METIERS_ROOT_PATH),
			...this.mapDynamicPathListResult(articleSlugListResult, ARTICLE_ROOT_PATH),
			...this.mapDynamicPathListResult(faqSlugListResult, FAQ_ROOT_PATH),
			...this.mapDynamicPathListResult(offreDeStageSlugListResult, STAGE_ROOT_PATH),
			...this.mapDynamicPathListResult(annonceDeLogementSlugListResult, ANNONCE_DE_LOGEMENT_ROOT_PATH),

		];
		const pathList = [...staticPathList, ...dynamicPathList];
		const localPaths = pathList.filter((path) => isInternalURL(path, this.baseUrl));
		return this.generateSiteMap(localPaths, this.baseUrl);
	}

	private flattenNavigationItemList(navigationItemList: Array<NavigationItem | NavigationItemWithChildren>): Array<string> {
		return navigationItemList.reduce((pathList: Array<string>, navigationItem: NavigationItem | NavigationItemWithChildren): Array<string> => {
			if (isNavigationItem(navigationItem)) {
				pathList.push(navigationItem.link);
			} else {
				pathList.push(...this.flattenNavigationItemList(navigationItem.children));
			}
			return pathList;
		}, []);
	}

	private mapDynamicPathListResult(dynamicPathListResult: Either<Array<string>>, rootPath: string): Array<string> {
		if (isSuccess(dynamicPathListResult)) {
			return dynamicPathListResult.result
				.map((path) => `/${rootPath}/${path}`);
		} else {
			return [];
		}
	}

	private generateSiteMap(pathList: string[], baseUrl: string) {
		return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pathList.map((path) => `
	<url>
		<loc>${this.escapeSpecialCharacters(new URL(path, baseUrl).toString())}</loc>
	</url>`).join('')}
</urlset>`;
	}

	private escapeSpecialCharacters(unsafeString: string): string {
		// NOTE (GAFI 13-06-2024): cf. https://www.sitemaps.org/fr/protocol.html#escaping
		return unsafeString.replace(/[<>&'"]/g, function (character) {
			switch (character) {
				case '<':
					return '&lt;';
				case '>':
					return '&gt;';
				case '&':
					return '&amp;';
				case '\'':
					return '&apos;';
				case '"':
					return '&quot;';
				default:
					return '';
			}
		});
	}
}
