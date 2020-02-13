const gulp = require('./gulpconfig/tasks/gulp_plugins').gulp
const plugins = require('./gulpconfig/tasks/gulp_plugins').plugins

const config  = require('./gulpconfig/gulp-config');

const fs = require('fs')
const glob = require('glob')

// Tasks

function loadPlugin(file) {
	return require(file).bind(null, gulp, plugins, config)
}


function getTaskList() {

	let arr = []

	for (let taskType in config.paths.src) {		
		if (glob.sync(config.paths.src[taskType]).length > 0) {
			arr.push(taskType)
		}
	}

	return arr

}

const audio = loadPlugin('./gulpconfig/tasks/gulp_audio')
const browserSync = loadPlugin('./gulpconfig/tasks/gulp_browserSync')
const clear = loadPlugin('./gulpconfig/tasks/gulp_clear')
const font = loadPlugin('./gulpconfig/tasks/gulp_font')
const html = loadPlugin('./gulpconfig/tasks/gulp_html')
const img = loadPlugin('./gulpconfig/tasks/gulp_img')
const js = loadPlugin('./gulpconfig/tasks/gulp_js')
const jsServer = loadPlugin('./gulpconfig/tasks/gulp_jsServer')
const tsServer = loadPlugin('./gulpconfig/tasks/gulp_tsServer')
const less = loadPlugin('./gulpconfig/tasks/gulp_less')
const nodemon = loadPlugin('./gulpconfig/tasks/gulp_nodemon')
const pug = loadPlugin('./gulpconfig/tasks/gulp_pug')
const ts = loadPlugin('./gulpconfig/tasks/gulp_ts')


gulp.task('test', function(done) {
	console.log("Your gulp is up and running!")
	return done()
})

gulp.task('plugins', function(done) {
	console.log(plugins);
	return done();
});

gulp.task('buildVersion', function(done) {
	
	let buildVersion = parseInt(fs.readFileSync('./gulpconfig/buildVersion', 'utf-8')) + 1
	fs.writeFileSync('./gulpconfig/buildVersion', '' + buildVersion)

	config.buildVersion = buildVersion
	
	return done();
})


gulp.task('clear', clear);

gulp.task('html', html);
gulp.task('pug', pug);
gulp.task('less', less);
gulp.task('js', js);
gulp.task('ts', ts);
gulp.task('jsServer', jsServer);
gulp.task('tsServer', tsServer);
gulp.task('img', img);
gulp.task('font', font);
gulp.task('audio', audio);

gulp.task('nodemon', nodemon);
gulp.task('browserSync', browserSync);


gulp.task('build', gulp.series('clear', 'buildVersion', gulp.parallel(getTaskList())))


gulp.task('watch', function(done) {

	let taskList = getTaskList()

	for (let taskName of taskList) {

		gulp.watch(config.paths.src[taskName], gulp.parallel(taskName));

	}

	return done();

});

gulp.task('default', gulp.series('build', gulp.parallel('browserSync', 'nodemon', 'watch')));
