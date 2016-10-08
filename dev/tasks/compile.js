'use strict';

const gulp = require( 'gulp' );
const gulpBabel = require( 'gulp-babel' );
const path = require( 'path' );

module.exports = () => {
	/**
	 * Tasks definitions.
	 */
	return {
		/**
		 * Compiles source files to specified format.
		 *
		 * @param {String} dest Destination path.
		 * @param {'esnext'|'cjs'} format Output format.
		 * @returns {Stream}
		 */
		compile( dest, format = 'esnext' ) {
			const plugins = [];

			if ( format == 'cjs' ) {
				plugins.push( [ 'babel-plugin-transform-es2015-modules-commonjs' ] );
			} else if ( format != 'esnext' ) {
				throw new Error( 'Unsupported format.' );
			}

			return gulp.src( path.join( __dirname, '..', '..', 'src', '**', '*.js' ) )
				.pipe( gulpBabel( { plugins } ) )
				.pipe( gulp.dest( dest ) );
		}
	};
};
