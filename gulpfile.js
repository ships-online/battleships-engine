'use strict';

const fs = require( 'fs' );
const gulp = require( 'gulp' );
const gulpFilter = require( 'gulp-filter' );
const gulpEslint = require( 'gulp-eslint' );
const KarmaServer = require( 'karma' ).Server;

const argv = require( 'minimist' )( process.argv.slice( 3 ), {
	boolean: [ 'coverage', 'debug' ],
	string: [ 'files' ],
	alias: {
		coverage: 'c',
		debug: 'd',
		files: 'f'
	}
} );
const karmaConfig = require( './karma.conf' );

/**
 * Paths definitions.
 */
const jsFiles = [ '**/*.js' ].concat( getGitIgnore() );

/**
 * Tasks definitions.
 */
const tasks = {
	/**
	 * Analyze quality and code style of JS files.
	 *
	 * @returns {Stream}
	 */
	lint() {
		return gulp.src( jsFiles )
			.pipe( gulpEslint() )
			.pipe( gulpEslint.format() )
			.pipe( gulpEslint.failAfterError() );
	},

	/**
	 * Lints staged files - pre commit hook.
	 *
	 * @returns {Stream}
	 */
	lintStaged() {
		const guppy = require( 'git-guppy' )( gulp );

		return guppy.stream( 'pre-commit', { base: './' } )
			.pipe( gulpFilter( jsFiles ) )
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
		new KarmaServer( karmaConfig( options ), done ).start();
	}
};

/**
 * Gets the list of ignores from `.gitignore`.
 *
 * @returns {Array<String>} The list of ignores.
 */
function getGitIgnore() {
	let gitIgnoredFiles = fs.readFileSync( '.gitignore', 'utf8' );

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

// JS code sniffer.
gulp.task( 'lint', tasks.lint );
gulp.task( 'pre-commit', tasks.lintStaged );

// JS unit tests.
gulp.task( 'test', ( done ) => tasks.test( done, argv ) );