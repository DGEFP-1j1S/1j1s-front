import { loadEnvConfig } from '@next/env';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vitest/config';

loadEnvConfig(process.cwd(), true);
process.env.TZ = 'utc';

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'~': path.resolve(__dirname, 'src'),
			'@tests': path.resolve(__dirname, 'tests'),
			'src': path.resolve(__dirname, 'src'),
			'public': path.resolve(__dirname, 'public'),
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./react-testing-library.setup.ts'],
		css: {
			modules: {
				classNameStrategy: 'non-scoped',
			},
		},
		environmentMatchGlobs: [
			['src/server/**/*.test.ts', 'node'],
			['src/pages/api/**/*.test.ts', 'node'],
		],
	},
});
