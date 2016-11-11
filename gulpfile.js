'use strict';

const config = {
	ROOT_PATH: __dirname
};

const path = require( 'path' );
const gulp = require( 'gulp' );
const utils = require( './dev/utils.js' )( config );
const lintTasks = require( './dev/tasks/lint.js' )( config );
const testTasks = require( './dev/tasks/test.js' )( config );

const options = utils.parseArgs( process.argv.slice( 3 ) );

// JS code sniffer.
const jsFiles = [ path.join( config.ROOT_PATH, '**', '*.js' ) ];

gulp.task( 'lint', () => lintTasks.lint( jsFiles ) );
gulp.task( 'pre-commit', () => lintTasks.lintStaged( jsFiles ) );

// JS unit tests.
gulp.task( 'test', ( done ) => testTasks.test( options, done ) );
