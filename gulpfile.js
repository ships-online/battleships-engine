'use strict';

const config = {
	ROOT_PATH: __dirname
};

const gulp = require( 'gulp' );
const utils = require( './dev/utils.js' )( config );
const lintTasks = require( './dev/tasks/lint.js' )( config );
const testTasks = require( './dev/tasks/test.js' )( config );

const options = utils.parseArgs( process.argv.slice( 3 ) );

// JS code sniffer.
gulp.task( 'lint', () => lintTasks.lint( './**/*.js' ) );
gulp.task( 'pre-commit', () => lintTasks.lintStaged( './**/*.js' ) );

// JS unit tests.
gulp.task( 'test', ( done ) => testTasks.test( options, done ) );
