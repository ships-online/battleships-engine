'use strict';

module.exports = () => {
	return {
		parseArgs( args ) {
			return require( 'minimist' )( args, {
				boolean: [ 'coverage', 'debug' ],
				string: [ 'files' ],
				alias: {
					coverage: 'c',
					debug: 'd',
					files: 'f'
				}
			} );
		}
	};
};
