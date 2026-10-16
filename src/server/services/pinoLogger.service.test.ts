import pino from 'pino';

import { SentryException } from '~/server/exceptions/sentryException';
import { PinoLoggerService } from '~/server/services/pinoLogger.service';

vi.mock('pino');

const pinoMock = vi.mocked(pino);
const mockedLogger = {
	debug: vi.fn(),
	error: vi.fn(),
	fatal: vi.fn(),
	info: vi.fn(),
	trace: vi.fn(),
	warn: vi.fn(),
};
pinoMock.mockImplementation(() => mockedLogger as unknown as pino.Logger<string>);

// FIXME (GAFI 07-07-2025): Leak réseau, pino-sentry n'est pas mock-é
describe.skip('PinoLoggerService', () => {
	describe('error', () => {
		it('appelle le logger error avec le message passé en paramètre', () => {
			const loggerService = new PinoLoggerService('https://12345@sentry.fabrique.social.gouv.fr/79', 'error', 'development');

			loggerService.error('mon erreur message');

			expect(mockedLogger.error).toHaveBeenCalledWith({ msg: 'mon erreur message' });
		});
	});

	describe('info', () => {
		it('appelle le logger info avec le message passé en paramètre', () => {
			const loggerService = new PinoLoggerService('https://12345@sentry.fabrique.social.gouv.fr/79', 'error', 'development');

			loggerService.info('mon info message');

			expect(mockedLogger.info).toHaveBeenCalledWith({ msg: 'mon info message' });
		});
	});

	describe('warn', () => {
		it('appelle le logger warn avec le message passé en paramètre', () => {
			const loggerService = new PinoLoggerService('https://12345@sentry.fabrique.social.gouv.fr/79', 'warn', 'development');

			loggerService.warn('mon warn message');

			expect(mockedLogger.warn).toHaveBeenCalledWith({ msg: 'mon warn message' });
		});
	});

	describe('warnWithExtra', () => {
		it('appelle le logger warn avec le message, les bons tags et les extras', () => {
			const loggerService = new PinoLoggerService('https://12345@sentry.fabrique.social.gouv.fr/79', 'warn', 'development');

			loggerService.warnWithExtra(new SentryException(
				'impossible d’effectuer une recherche',
				{ context: 'GET stages', source: 'API LeBonStage' },
				{ stacktrace: 'response is undefined at line 32...' },
			));

			expect(mockedLogger.warn).toHaveBeenCalledWith({ extra: { stacktrace: 'response is undefined at line 32...' }, msg: 'impossible d’effectuer une recherche', tags: { context: 'GET stages', source: 'API LeBonStage' } });
		});
	});

	describe('errorWithExtra', () => {
		it('appelle le logger error avec le message, les bons tags et les extras', () => {
			const loggerService = new PinoLoggerService('https://12345@sentry.fabrique.social.gouv.fr/79', 'error', 'development');

			loggerService.errorWithExtra(new SentryException(
				'impossible d’effectuer une recherche',
				{ context: 'GET stages', source: 'API LeBonStage' },
				{ stacktrace: 'response is undefined at line 32...' },
			));

			expect(mockedLogger.error).toHaveBeenCalledWith({ extra: { stacktrace: 'response is undefined at line 32...' }, msg: 'impossible d’effectuer une recherche', tags: { context: 'GET stages', source: 'API LeBonStage' } });
		});
	});
});
