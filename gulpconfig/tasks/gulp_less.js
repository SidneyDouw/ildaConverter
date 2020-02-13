module.exports = function(gulp, plugins, config) {

    return gulp.src(config.paths.src.less)
	.pipe(plugins.plumber(function(error) {
		plugins.util.log(plugins.util.colors.red('--------------------------------------------------\n\n'))
		plugins.util.log(plugins.util.colors.red('Error (' + error.plugin + '):\n' + error.message + '\n\n'))
		plugins.util.log(plugins.util.colors.red('--------------------------------------------------\n'))
	}))
	.pipe(plugins.concat(config.paths.files.css))
	.pipe(plugins.if(!config.isProduction, plugins.sourcemaps.init()))
	.pipe(plugins.less())
	.on('error', function() {
		this.emit('end')
	})
	.pipe(plugins.cleanCss())
	.pipe(plugins.if(!config.isProduction, plugins.sourcemaps.write()))
	.pipe(gulp.dest(config.paths.dest.css))
	.pipe(plugins.browserSync.stream())

}