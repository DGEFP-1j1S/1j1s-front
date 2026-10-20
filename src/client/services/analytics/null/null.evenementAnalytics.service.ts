import { EvenementAnalyticsService } from "../analytics.service";

export class NullEvenementAnalyticsService implements EvenementAnalyticsService {
	envoyerEvenement(): void {}
}
