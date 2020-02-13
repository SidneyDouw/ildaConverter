module.exports = function(gulp, plugins, config) {

	return gulp.src(config.paths.src.html)
	.pipe(gulp.dest(config.paths.dest.client))
	.pipe(plugins.browserSync.stream());

};