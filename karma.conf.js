'use strict';

const rollupBabel = require('rollup-plugin-babel');

// Karma configuration
module.exports = (config) => {
	config.set({
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: './',

		// Frameworks to use
		frameworks: [ 'mocha', 'chai', 'sinon' ],

		// Test results reporter to use
		// Possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		reporters: [ 'mocha' ],

		// Web server port
		port: 9876,

		preprocessors: {
			'tests/**/*.js': [ 'rollup' ]
		},

		rollupPreprocessor: {
			rollup: {
				plugins: [
					rollupBabel( {
						presets: [ 'es2015-rollup' ]
					} )
				]
			},
			bundle: {
				sourceMap: 'inline'
			}
		},

		files: [
			// Polyfills.
			'node_modules/babel-polyfill/dist/polyfill.min.js',

			// Test files.
			'tests/**/*.js'
		],

		// Enable / disable colors in the output (reporters and logs)
		colors: true,

		// Level of logging
		// Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// Enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - PhantomJS2
		// - IE (only Windows)
		browsers: [ 'PhantomJS2' ],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,

		// Continuous Integration mode
		// If true, it capture browsers, run tests and exit
		singleRun: true
	});
};
