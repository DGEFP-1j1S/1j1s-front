import { GénérerRobotsUseCase } from '~/server/robots/useCases/générerRobots.useCase';
import { ConfigurationService } from '~/server/services/configuration.service';

export interface RobotsDependencies {
	générerRobotsUseCase: GénérerRobotsUseCase
}

export function robotsDependenciesContainer(configurationService: ConfigurationService) {
	return {
		générerRobotsUseCase: new GénérerRobotsUseCase(configurationService.getConfiguration().ENVIRONMENT),
	};
}
