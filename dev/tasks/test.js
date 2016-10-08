'use strict';

const KarmaServer = require( 'karma' ).Server;
const karmaConfig = require( '../karma.conf.js' );

module.exports = ( config ) => {
	/**
	 * Tasks definitions.
	 */
	return {
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
		}
	};
};
