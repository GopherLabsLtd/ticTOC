import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import { terser } from "rollup-plugin-terser";
import sass from 'rollup-plugin-sass';

const outputDir = process.env.ENV === "demo" ? "./demo/dist" : "./dist"
export default {
	input: 'src/index.ts',
	output: [
		{
			file: `${outputDir}/index.js`,
			format: 'cjs'
		},
		{
			file: `${outputDir}/${pkg.module}`,
			format: 'es'
		},
		{
			file: `${outputDir}/${pkg.browser}`,
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
		terser(),
		// CSS plugins
		sass({
			// Write all styles to the bundle destination where .js is replaced by .css
			output: true,

			// Filename to write all styles
			output: `${outputDir}/styles.css`
		})
	]
};
