/**
 *  Give Gulp File
 *
 *  @description: Used for automating development tasks using Gulp.js
 *  @author: Devin
 *  @created: 12/30/2014
 */

/* Modules (Can be installed with npm install command using package.json)
 ------------------------------------- */
var gulp = require( 'gulp' ),
	gutil = require( 'gulp-util' ),
	autoprefixer = require( 'gulp-autoprefixer' ),
	uglify = require( 'gulp-uglify' ),
	sass = require( 'gulp-sass' ),
	sourcemaps = require( 'gulp-sourcemaps' ),
	concat = require( 'gulp-concat' ),
	rename = require( 'gulp-rename' ),
	plumber = require( 'gulp-plumber' ),
	notify = require( "gulp-notify" ),
	watch = require( "gulp-watch" ),
	livereload = require( "gulp-livereload" ),
	minifyCSS = require( "gulp-minify-css" );

/* Paths
 ------------------------------------- */
var source_paths = {
	admin_styles   : ['./assets/scss/admin/give-admin.scss'],
	frontend_styles: ['./assets/scss/frontend/give-frontend.scss'],
	scripts        : ['./assets/js/*.js', '!./assets/js/*.min.js' ]
};

/* Admin SCSS Task
 ------------------------------------- */
gulp.task( 'admin_styles', function () {
	return gulp.src( source_paths.admin_styles )
		.pipe( sourcemaps.init() )
		.pipe( sass( {
			errLogToConsole: true
		} ) )
		.pipe( autoprefixer() )
		.pipe( sourcemaps.write( './maps' ) )
		.pipe( gulp.dest( './assets/css' ) )
		.pipe( rename( 'give-admin.min.css' ) )
		.pipe( minifyCSS() )
		.pipe( gulp.dest( './assets/css' ) )
		.pipe( livereload() )
		.pipe( notify( {
			message: 'Admin styles task complete!',
			onLast : true //only notify on completion of task
		} ) );
} );

/* Frontend SCSS Task
 ------------------------------------- */
gulp.task( 'frontend_styles', function () {
	return gulp.src( source_paths.frontend_styles )
		.pipe( sourcemaps.init() )
		.pipe( sass( {
			errLogToConsole: true
		} ) )
		.pipe( autoprefixer() )
		.pipe( rename( 'give.css' ) )
		.pipe( sourcemaps.write( '../assets/css/maps' ) )
		.pipe( gulp.dest( './templates' ) )
		.pipe( rename( 'give.min.css' ) )
		.pipe( minifyCSS() )
		.pipe( gulp.dest( './templates' ) )
		.pipe( livereload() )
		.pipe( notify( {
			message: 'Frontend styles task complete!',
			onLast : true //only notify on completion of task
		} ) );
} );

// Concatenate & Minify JS
gulp.task( 'scripts', function () {
	return gulp.src( source_paths.scripts )
		.pipe( uglify({
			preserveComments: 'all'
		}) )
		.pipe( rename( {suffix: ".min"} ) )
		.pipe( gulp.dest( 'assets/js' ) )
		.pipe( notify( {
			message: 'Scripts task complete!',
			onLast : true //only notify on completion of task
		 } ) )
		.pipe( livereload() );
} );

/* Watch Files For Changes
 ------------------------------------- */
gulp.task( 'watch', function () {

	//Start up livereload on this biz
	livereload.listen();

	//Add watching on Admin SCSS-files
	gulp.watch( 'assets/scss/admin/*.scss', function () {
		gulp.start( 'admin_styles' );
	} );

	//Add watching on Frontend SCSS-files
	gulp.watch( 'assets/scss/frontend/*.scss', function () {
		gulp.start( 'frontend_styles' );
	} );

	//Add watching on JS files
	gulp.watch( source_paths.scripts, function () {
		gulp.start( 'scripts' );
	} );

	//Add watching on template-files
	gulp.watch( 'templates/*.php', function () {
		livereload(); //and reload when changed
	} );

} );

/* Handle errors elegantly with gulp-notify
 ------------------------------------- */
var onError = function ( err ) {
	gutil.log( '======= ERROR. ========\n' );
	notify.onError( "ERROR: " + err.plugin )( err ); // for growl
	gutil.beep();
	this.end();
};

/* Default Gulp task
 ------------------------------------- */
gulp.task( 'default', function () {
	gulp.start( 'admin_scripts', 'frontend_styles', 'scripts', 'watch' );
	notify( {message: 'Styles task complete'} )
} );