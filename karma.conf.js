'use strict';

const webpackConfig = require( './webpack.conf.js' );

// Karma configuration
module.exports = ( options ) => {
	const karmaConfig = {
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: './',

		// List of files/patterns to load in the browser.
		files: [
			'tests/**/*.js'
		],

		// Frameworks to use
		frameworks: [ 'mocha', 'chai', 'sinon' ],

		// Preprocess matching files before serving them to the browser.
		// Available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'tests/**/*.js': [ 'webpack', 'sourcemap' ],
			'src/**/*.js': [ 'webpack', 'sourcemap' ]
		},

		// Webpack configuration.
		webpack: webpackConfig,

		// Test results reporter to use
		// Possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		reporters: [ 'mocha' ],

		coverageReporter: {
			dir: 'coverage/',
			reporters: [
				{ type: 'html', subdir: 'html' }
			]

		},

		// Web server port
		port: 9876,

		// Enable / disable colors in the output (reporters and logs)
		colors: true,

		// Level of logging
		// Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: 'INFO',

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - PhantomJS2
		// - IE (only Windows)
		browsers: [ 'Chrome' ],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,

		// Enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		// Continuous Integration mode
		// If true, it capture browsers, run tests and exit
		singleRun: true
	};

	if ( options.files ) {
		karmaConfig.files = [ options.files ];
	}

	if ( options.coverage ) {
		karmaConfig.reporters.push( 'coverage' );
	}

	return karmaConfig;
};
