'use strict';

const fs = require( 'fs' );
const gulp = require( 'gulp' );
const gulpEslint = require( 'gulp-eslint' );
const gulpFilter = require( 'gulp-filter' );
const Server = require( 'karma' ).Server;

const jsFiles = [ '**/*.js' ].concat( getGitIgnore() );

const tasks = {
	test( done ) {
		new Server( {
			configFile: __dirname + '/karma.conf.js'
		}, done ).start();
	},

	lint() {
		return gulp.src( jsFiles )
			.pipe( gulpEslint() )
			.pipe( gulpEslint.format() )
			.pipe( gulpEslint.failAfterError() );
	},

	lintStaged() {
		const guppy = require( 'git-guppy' )( gulp );

		return guppy.stream( 'pre-commit', { base: './' } )
			.pipe( gulpFilter( jsFiles ) )
			.pipe( gulpEslint() )
			.pipe( gulpEslint.format() )
			.pipe( gulpEslint.failAfterError() );
	}
};

/**
 * Gets the list of ignores from `.gitignore`.
 *
 * @returns {String[]} The list of ignores.
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

gulp.task( 'test', tasks.test );
gulp.task( 'lint', tasks.lint );
gulp.task( 'pre-commit', tasks.lintStaged );
