const glob = require('glob')

module.exports = function(gulp, plugins, config) {

	let fileArr = glob.sync(config.paths.src.pug)

	// Filter pug files
	// Currently based on the word 'static', probably not the best idea
	// But works for default setup

	let basePath = config.paths.src.pug.split('*')[0]

	let staticStream = fileArr.filter((path, index) => {
		if (path.includes('static')) {
			return path
		}
	})
	let dynamicStream = fileArr.filter((path, index) => {
		if (!path.includes('static')) {
			return path
		}
	})



	// Static

	gulp.src(staticStream)
    .pipe(plugins.plumber(function(error) {
		plugins.util.log(plugins.util.colors.red('--------------------------------------------------\n\n'))
		plugins.util.log(plugins.util.colors.red('Error (' + error.plugin + '):\n' + error.message + '\n\n'));
		plugins.util.log(plugins.util.colors.red('--------------------------------------------------\n'))
	}))
    .pipe(plugins.pug({
		locals: {
			buildVersion: config.buildVersion
		}
	}))
    .on('error', function() {
        this.emit('end');
	})
	.pipe(gulp.dest(config.paths.dest.client))
	.pipe(plugins.browserSync.stream());

	
	// Dynamic

	return gulp.src(dynamicStream, {base: basePath})
	.pipe(gulp.dest(config.paths.dest.views))
	.pipe(plugins.browserSync.stream());
};