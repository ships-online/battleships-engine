'use strict';

const path = require( 'path' );
const fs = require( 'fs' );
const gulp = require( 'gulp' );
const gulpFilter = require( 'gulp-filter' );
const gulpEslint = require( 'gulp-eslint' );
const gulpBabel = require( 'gulp-babel' );
const KarmaServer = require( 'karma' ).Server;
const karmaConfig = require( './karma.conf.js' );

module.exports = ( config ) => {
	/**
	 * Tasks definitions.
	 */
	return {
		/**
		 * Analyze quality and code style of JS files.
		 *
		 * @params {Array} files Files list.
		 * @returns {Stream}
		 */
		lint( files ) {
			const filesToLint = files.concat( getGitIgnore() );

			return gulp.src( filesToLint )
				.pipe( gulpEslint() )
				.pipe( gulpEslint.format() )
				.pipe( gulpEslint.failAfterError() );
		},

		/**
		 * Lints staged files - pre commit hook.
		 *
		 * @params {Array} files Files list.
		 * @returns {Stream}
		 */
		lintStaged( files ) {
			const filesToLint = files.concat( getGitIgnore( config ) );
			const guppy = require( 'git-guppy' )( gulp );

			return guppy.stream( 'pre-commit', { base: config.ROOT_PATH } )
				.pipe( gulpFilter( filesToLint ) )
				.pipe( gulpEslint() )
				.pipe( gulpEslint.format() )
				.pipe( gulpEslint.failAfterError() );
		},

		/**
		 * Runs JS unit tests.
		 *
		 * @param {Function} done Finish callback.
		 * @param {Object} [options={}] Additional options.
		 * @param {Boolean} [options.coverage] When `true` then coverage report will be generated.
		 * @param {String} [options.files] Glob with selected for test files.
		 */
		test( done, options ) {
			new KarmaServer( karmaConfig( config, options ), done ).start();
		},

		/**
		 * Compile source files to specified format.
		 *
		 * @param {String} src Source file glob.
		 * @param {String} dest Destination path.
		 * @param {'esnext'|'cjs'} format Output format.
		 * @returns {Stream}
		 */
		compile( src, dest, format = 'esnext' ) {
			const plugins = [];


			if ( format == 'cjs' ) {
				plugins.push( 'babel-plugin-transform-es2015-modules-commonjs' );
			} else if ( format != 'esnext' ) {
				throw new Error( 'Unsupported format.' );
			}

			return gulp.src( src )
				.pipe( gulpBabel( { plugins } ) )
				.pipe( gulp.dest( dest ) );
		}
	};

	/**
	 * Gets the list of ignores from `.gitignore`.
	 *
	 * @returns {Array<String>} The list of ignores.
	 */
	function getGitIgnore() {
		let gitIgnoredFiles = fs.readFileSync( path.join( config.ROOT_PATH, '.gitignore' ), 'utf8' );

		return gitIgnoredFiles
			// Remove comment lines.
			.replace( /^#.*$/gm, '' )
			// Transform into array.
			.split( /\n+/ )
			// Remove empty entries.
			.filter( ( path ) => !!path )
			// Add `!` for ignore glob.
			.map( i => '!' + i );
	}
};
