import { CRAWLER_NOT_PRODUCTION_MODE, CRAWLER_PRODUCTION_MODE } from '~/server/robots/domain/robots';

const PRODUCTION_ENVIRONMENT = 'production';

export class GénérerRobotsUseCase {
	constructor(private environment: string) {
	}

	async handle(): Promise<string> {
		const isProduction = this.environment === PRODUCTION_ENVIRONMENT;
		const robotsContent = isProduction ? CRAWLER_PRODUCTION_MODE : CRAWLER_NOT_PRODUCTION_MODE;
		return Promise.resolve(robotsContent);
	}
}
