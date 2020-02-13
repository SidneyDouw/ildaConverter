module.exports = function(gulp, plugins, config) {

	return gulp.src(config.paths.src.font)
	.pipe(gulp.dest(config.paths.dest.font));

};