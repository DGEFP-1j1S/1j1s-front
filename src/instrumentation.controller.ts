import * as Sentry from '@sentry/nextjs';

import pkg from '../package.json' with { type: 'json' };

// NOTE (JFE 25-09-2026): sentry 11 ne charge plus sentry.server.config.ts ni sentry.edge.config.ts : l’init doit vivre dans le register() d’un fichier d’instrumentation Next.
const { name, version } = pkg;

const DEFAULT_SENTRY_ENVIRONMENT = 'local';
const USER_AGENT_BLACKLIST = process.env.NEXT_PUBLIC_SENTRY_USER_AGENT_BLACKLIST?.split(',');
const SENTRY_ENVIRONMENTS_ENABLE_SEND_DATA = ['recette', 'production', 'review_app'];
const SENTRY_ENVIRONMENTS_ENABLE_DEBUG = ['local', 'review_app'];
const RUNTIME_ENVIRONMENT = process.env.ENVIRONMENT || process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || DEFAULT_SENTRY_ENVIRONMENT;
const SHOULD_INIT = RUNTIME_ENVIRONMENT === 'production';
const SEND_DATA = SENTRY_ENVIRONMENTS_ENABLE_SEND_DATA.includes(process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || '');
const DEBUG_DATA = SENTRY_ENVIRONMENTS_ENABLE_DEBUG.includes(process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || '');

const releaseName = (suffixe: string, environnement = process.env) => {
	if(environnement.NEXT_PUBLIC_SENTRY_ENVIRONMENT === 'review_app') {
		return `${name}@review+${version}-${suffixe}`;
	}
	return `${name}@${version}-${suffixe}`;
};

export function register() {
	if (!SHOULD_INIT) {
		return;
	}

	const suffixeDeRelease = process.env.NEXT_RUNTIME === 'edge' ? 'edge' : 'server';

	Sentry.init({
		beforeSend(event) {
			if(!SEND_DATA) {
				return null;
			}
			if (!event.request?.headers) {
				return event;
			}
			const userAgent: string | undefined = event.request.headers['user-agent'];
			const userAgentDuBot = USER_AGENT_BLACKLIST?.find((botUserAgent) => userAgent?.includes(botUserAgent));
			if (userAgentDuBot !== undefined) {
				return null; // Don't send this event to Sentry
			}
			return event;
		},
		debug: DEBUG_DATA,
		dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
		enabled: true,
		environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || DEFAULT_SENTRY_ENVIRONMENT,
		initialScope: {
			level: process.env.NEXT_PUBLIC_SENTRY_LOG_LEVEL as Sentry.SeverityLevel,
		},
		release: releaseName(suffixeDeRelease),
		sendClientReports: SEND_DATA,
		tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE),
	});
}
