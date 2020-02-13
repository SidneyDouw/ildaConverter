module.exports = function(gulp, plugins, config) {
	
	return gulp.src(config.paths.src.audio)
	.pipe(gulp.dest(config.paths.dest.audio));

};