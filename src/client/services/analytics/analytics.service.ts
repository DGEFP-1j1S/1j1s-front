import { PageTags } from './analytics';


export interface AnalyticsService {
	isAllowed(): boolean;
}
export interface ManualAnalyticsService extends AnalyticsService {
	envoyerAnalyticsPageVue(tags: PageTags): void;
}
