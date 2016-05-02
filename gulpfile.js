var gulp = require('gulp');
var concat = require('gulp-concat');
var iife = require('gulp-iife');
var minify = require('gulp-minify');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var Server = require('karma').Server;

gulp.task('default',['scripts', 'demo']);

gulp.task('scripts', function() {
  return gulp.src('src/ng-gauge.js')
	.pipe(minify({
      ext:{
          src:'.js',
          min:'.min.js'
      },
  }))
	.pipe(gulp.dest('./dist'));
});

gulp.task('demo', function(){
	return gulp.src('src/controller.js')
	.pipe(iife())
	.pipe(rename('demo.js'))
	.pipe(gulp.dest('./demo'));
});

gulp.task('watch', function(){
	gulp.watch('src/**/*.js', ['scripts', 'demo']);
});

gulp.task('test', function(done){
	new Server({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done).start();
});
