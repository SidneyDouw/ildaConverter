module.exports = async function(gulp, plugins, config) {

	return plugins.nodemon({
		script: 'dist/server/app.js',
		watch: 'dist/server/app.js'
	})
	.on('restart', () => {
		plugins.browserSync.reload({stream: false})
	})

};