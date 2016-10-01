const rootPath = __dirname;

module.exports = {
	resolve: {
		root: [ rootPath ]
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