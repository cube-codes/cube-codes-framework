import noderesolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [{
	input: 'dist/package/index.rollup.js',
	output: {
		name: 'CCIW',
		file: 'dist/browser/browser.js',
		format: 'iife',
		sourcemap: 'inline'
	},
	plugins: [
		noderesolve({
			browser: true
		}),
		commonjs()
	],
}];