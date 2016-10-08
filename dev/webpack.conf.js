'use strict';

module.exports = ( config ) => {
	return {
		resolve: {
			root: [ config.ROOT_PATH ]
		},

		module: {
			preLoaders: [
				{
					test: /\.js$/,
					exclude: /(node_modules)/,
					loader: 'babel',
					query: {
						cacheDirectory: true,
						plugins: [
							'transform-es2015-modules-commonjs',
							[ 'istanbul', { 'exclude': [ 'tests/**/*.js' ] } ]
						]
					}
				}
			]
		},

		devtool: 'eval'
	};
};
