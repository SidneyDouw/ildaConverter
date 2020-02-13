module.exports = {

    gulp: require('gulp'),
	plugins: require('gulp-load-plugins')({
		pattern: ['*'],
		rename: {
			'jshint': 		'jshintGlobal',
			'tslint':		'tslintGlobal',
			'pug':			'pugGlobal',
			'typescript':	'typescriptGlobal'
		}
	})

}