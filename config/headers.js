const STRAPI_MEDIA_HOST = new URL(process.env.STRAPI_MEDIA_URL).hostname;
const TRUSTED_SOURCES = '*.fabrique.social.gouv.fr *.meilisearch.io/multi-search *.meilisearch.com/multi-search 1j1s-front.osc-fr1.scalingo.io *.1jeune1solution.gouv.fr';
const ANALYTICS_SOURCES = `${process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN} ${process.env.NEXT_PUBLIC_ANALYTICS_MATOMO_HOST}`;
const MARKETING_SCRIPT_SOURCES = "https://www.googletagmanager.com https://tags.srv.stackadapt.com https://*.goldenbees.fr";
const MARKETING_IMG_SOURCES = "https://*.doubleclick.net https://www.googletagmanager.com https://*.adform.net https://tags.srv.stackadapt.com https://*.goldenbees.fr";
const MARKETING_CONNECT_SOURCES = "https://*.doubleclick.net https://www.google.com https://www.googletagmanager.com https://*.stackadapt.com https://*.goldenbees.fr";
const contentSecurityPolicy = `
  default-src 'self' ${TRUSTED_SOURCES} *.myjobglasses.com https://fonts.gstatic.com/ ${MARKETING_CONNECT_SOURCES};
  script-src 'self' ${ANALYTICS_SOURCES} https://*.adform.net *.myjobglasses.com ${MARKETING_SCRIPT_SOURCES};
  img-src 'self' *.google.com data: ${STRAPI_MEDIA_HOST} ${ANALYTICS_SOURCES} img.youtube.com jedonnemonavis.numerique.gouv.fr *.myjobglasses.com ${MARKETING_IMG_SOURCES};
  style-src 'self' 'unsafe-inline' ${ANALYTICS_SOURCES} *.myjobglasses.com https://fonts.googleapis.com https://tags.srv.stackadapt.com;
  frame-ancestors 'none';
  frame-src 'self' *.apprentissage.beta.gouv.fr immersion-facile.beta.gouv.fr deposer-offre.www.1jeune1solution.gouv.fr *.youtube-nocookie.com https://*.adform.net mes-aides.francetravail.fr https://*.doubleclick.net https://www.googletagmanager.com;
  form-action 'self';
  base-uri 'none';
`;

const SECURITY_MODE_HEADERS = [{
	headers: [{
		key: 'X-DNS-Prefetch-Control',
		value: 'on',
	}, {
		key: 'Strict-Transport-Security',
		value: 'max-age=63072000; includeSubDomains; preload',
	}, {
		key: 'X-Content-Type-Options',
		value: 'nosniff',
	}, {
		key: 'Referrer-Policy',
		value: 'no-referrer, strict-origin-when-cross-origin',
	}, {
		key: 'Content-Security-Policy',
		value: contentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
	}],
	source: '/:path*',
}];

const LOCAL_MODE_HEADERS = [{
	headers: [{
		key: 'X-DNS-Prefetch-Control',
		value: 'on',
	}, {
		key: 'Strict-Transport-Security',
		value: 'max-age=63072000; includeSubDomains; preload',
	}, {
		key: 'X-Content-Type-Options',
		value: 'nosniff',
	}, {
		key: 'Referrer-Policy',
		value: 'no-referrer, strict-origin-when-cross-origin',
	}, {
		key: 'Content-Security-Policy',
		value: contentSecurityPolicy.replace('script-src', "script-src 'unsafe-eval'").replace(/\s{2,}/g, ' ').trim(),
	}],
	source: '/:path*',
}];

module.exports = { LOCAL_MODE_HEADERS, SECURITY_MODE_HEADERS };
