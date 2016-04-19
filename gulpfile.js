var gulp = require('gulp');
var concat = require('gulp-concat');
var iife = require('gulp-iife');
var minify = require('gulp-minify');
var uglify = require('gulp-uglify');
var Server = require('karma').Server;

gulp.task('default',['vendors', 'scripts']);

gulp.task('vendors', function(){
	return gulp.src(['bower_components/angular/angular.min.js', 'bower_components/d3/d3.min.js'])
	.pipe(uglify())
	.pipe(concat('vendors.js'))
	.pipe(gulp.dest('./dist'));
});

gulp.task('scripts', function() {
  return gulp.src('src/**/*.js')
	.pipe(iife())
	.pipe(concat('all.js'))
	.pipe(gulp.dest('./dist'));
});

gulp.task('watch', function(){
	gulp.watch('src/**/*.js', ['scripts']);
});

gulp.task('test', function(done){
	new Server({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done).start();
});
