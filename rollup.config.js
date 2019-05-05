import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import { terser } from "rollup-plugin-terser";
import sass from 'rollup-plugin-sass';

export default {
	input: 'src/index.ts',
	output: [
		{
			file: `dist/index.js`,
			format: 'cjs'
		},
		{
			file: `dist/${pkg.module}`,
			format: 'es'
		},
		{
			file: `dist/${pkg.browser}`,
			format: 'iife',
			name: 'TicTOC'
		}
	],
	external: [
		...Object.keys(pkg.dependencies || {})
	],
	plugins: [
		typescript({
			typescript: require('typescript'),
		}),
		// terser(),
		// CSS plugins
		sass({
			// Write all styles to the bundle destination where .js is replaced by .css
			output: true,

			// Filename to write all styles
			output: './dist/styles.css'
		})
	]
};
