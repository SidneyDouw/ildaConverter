module.exports = function(gulp, plugins, config) {

	return gulp.src(config.paths.src.jsServer)
	.pipe(plugins.jshint({
		esversion: 6,
		asi: true
	}))
	.pipe(plugins.jshint.reporter('jshint-stylish'))
	.pipe(gulp.dest(config.paths.dest.server))
};