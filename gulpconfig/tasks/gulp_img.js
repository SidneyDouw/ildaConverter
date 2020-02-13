module.exports = function(gulp, plugins, config) {

	return gulp.src(config.paths.src.img)
    .pipe(plugins.imagemin([
		plugins.imagemin.jpegtran({progressive: true}),
		plugins.imagemin.optipng({optimizationLevel: 5})
	], {
		verbose: true
	}))
    .pipe(gulp.dest(config.paths.dest.img));

};