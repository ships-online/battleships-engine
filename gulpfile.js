'use strict';

const config = {
	ROOT_PATH: '.'
};

const gulp = require( 'gulp' );
const utils = require( './dev/utils.js' )( config );
const tasks = require( './dev/tasks.js' )( config );

const options = utils.parseArgs( process.argv.slice( 3 ) );

// JS code sniffer.
gulp.task( 'lint', () => tasks.lint( './**/*.js' ) );
gulp.task( 'pre-commit', () => tasks.lintStaged( './**/*.js' ) );

// JS unit tests.
gulp.task( 'test', ( done ) => tasks.test( done, options ) );
