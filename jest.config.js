module.exports = {
	preset: 'ts-jest',
	moduleFileExtensions: [
		'ts', 'js'
	],
	testEnvironment: 'node',
	transform: {
		'^.+\\.ts$': 'ts-jest'
	},
	testMatch: [
		'**/test/**/*.ts'
	],
	'transformIgnorePatterns': [
		'node_modules/(?!(js-utils|battleships-)/)'
	],
	globals: {
		'ts-jest': {
			isolatedModules: true
		}
	}
};
