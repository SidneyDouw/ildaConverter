module.exports = function(gulp, plugins, config) {

	return gulp.src(config.paths.src.tsServer)
    .pipe(plugins.tslint())
    .pipe(plugins.typescript({
        module: "commonjs",
        target: "es6",
        sourceMap: true,
        noImplicitAny: true,
        removeComments: true,
        preserveConstEnums: true,
        esModuleInterop: true,
        lib: ["es2016"]
    }))
    .on('error', function() {
		this.emit('end');
    })
    .pipe(gulp.dest(config.paths.dest.server))

};