module.exports = async function(gulp, plugins, config, done) {
	
	return plugins.browserSync.init(config.browserSync);
    
};