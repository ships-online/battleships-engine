'use strict';

const path = require( 'path' );
const gulp = require( 'gulp' );
const Server = require( 'karma' ).Server;

const src = './src';
const dist = './dist';

const tasks = {
	test( done ) {
		new Server( {
			configFile: __dirname + '/karma.conf.js'
		}, done ).start();
	}
};

gulp.task( 'test', tasks.test );
