module.exports = function(gulp, plugins, config) {
	
	return plugins.del(config.paths.dest.root);

};