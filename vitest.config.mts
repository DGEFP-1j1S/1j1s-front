import nextEnv from '@next/env';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defaultExclude, defineConfig } from 'vitest/config';

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd(), true);
process.env.TZ = 'utc';

const TESTS_SERVEUR = ['src/server/**/*.test.ts', 'src/pages/api/**/*.test.ts'];

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'~': path.resolve(import.meta.dirname, 'src'),
			'@tests': path.resolve(import.meta.dirname, 'tests'),
			'src': path.resolve(import.meta.dirname, 'src'),
			'public': path.resolve(import.meta.dirname, 'public'),
		},
	},
	test: {
		globals: true,
		setupFiles: ['./react-testing-library.setup.ts'],
		css: {
			modules: {
				classNameStrategy: 'non-scoped',
			},
		},
		projects: [
			{
				extends: true,
				test: {
					name: 'serveur',
					environment: 'node',
					include: TESTS_SERVEUR,
				},
			},
			{
				extends: true,
				test: {
					name: 'navigateur',
					environment: 'jsdom',
					exclude: [...defaultExclude, ...TESTS_SERVEUR],
				},
			},
		],
	},
});
