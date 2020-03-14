const MinifyPlugin = require("babel-minify-webpack-plugin");

const prod = (process.argv[3] == '-p' || process.argv[3] == '--production') ? true : false;

let webPackSourcemaps;

if (prod) {
	console.log('\nUsing Production Build...\n');
	webPackSourcemaps = 'false';
} else {
	webPackSourcemaps = 'eval-source-map';
}


let Configuration = function() {

		this.paths = {
			src: {
				html: 		'src/client/html/**/*.html',
				pug: 		'src/pug/**/*.pug',
				less:   	'src/client/less/**/*.less',
				// js: 		'src/client/js/**/*.js',
				ts:			'src/client/ts/**/*.ts',
				// jsServer:	'src/server/**/*.js',
				tsServer:	'src/server/**/*.ts',
				img:		'src/client/img/**/*',
				font:		'src/client/fonts/**/*',
				audio:		'src/client/audio/**/*',
			},
			dest: {
				root: 		'dist/',
				client:		'dist/client/',
				server:		'dist/server/',
				views:		'dist/views/',
				css:    	'dist/client/css/',
				js: 		'dist/client/js/',
				img:		'dist/client/img/',
				font:		'dist/client/fonts/',
				audio:		'dist/client/audio/'
			},
			files: {
				css: 'styles.min.css',
				js: 'index.min.js'
			}
		}
		
		this.browserSync = {
			// server: 'dist/'
			proxy: 'localhost:8082',
			port: 3641,
			https: true
		}
			
		this.webpack = {
			entry: {
				js: {
					index: './src/client/js/index.js',
					// index2: ./src/client/js/index2.js
				},
				ts: {
					index: './src/client/ts/index.ts',
				}
			},
			module: {
				rules: [{
					test: /\.ts?$/,
					exclude: /node_modules/,
					use: [{
						loader: 'ts-loader',
						options: {}
					}],
				}]
			},
			resolve: {
				extensions: ['.ts', '.js']
			},
			output: {
				filename: '[name].min.js'
			},
			mode: prod ? 'production' : 'development',
			devtool: webPackSourcemaps,
			plugins: [
				new MinifyPlugin()
			]
		}

		this.isProduction = prod
		
}


module.exports = new Configuration()