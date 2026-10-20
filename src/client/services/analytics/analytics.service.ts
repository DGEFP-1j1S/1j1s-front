import { EvenementAnalytics, PageTags } from './analytics';


export interface AnalyticsService {
	isAllowed(): boolean;
}
export interface ManualAnalyticsService extends AnalyticsService {
	envoyerAnalyticsPageVue(tags: PageTags): void;
}

export interface EvenementAnalyticsService {
	envoyerEvenement(evenement: EvenementAnalytics): void;
}
