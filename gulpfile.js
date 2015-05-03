/* gulp file.
* sudo npm install 
	gulp-load-plugins 
	main-bower-files 
	gulp-filter 
	gulp-ruby-sass 
	gulp-autoprefixer 
	gulp-minify-css 
	gulp-jshint 
	gulp-concat 
	gulp-uglify 
	gulp-imagemin 
	gulp-notify 
	gulp-rename 
	gulp-livereload 
	gulp-cache 
	del 
	--save-dev
======
bower components :
 bower install fontawesome --save
 bower install uikit --save
 bower install jquery -- save
*/


//create var dependencies
var gulp = require('gulp');
	  sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
	  uglify = require('gulp-uglify');
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    jshint = require ('gulp-jshint'),
    del = require('del'),
    lr = require('tiny-lr'),
    server = lr(),
    bower = require('gulp-bower');
    //mainBowerFiles = require('main-bower-files');


//bower + sass path
var config = {
  bowerDir: './bower_components',
  sassPath: './resources/sass'
}


//bower task
gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest(config.bowerDir))
});

//font awesome goes to public folder
gulp.task('icons',function() {
  return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*')
  .pipe(gulp.dest('./public/fonts'));
});

// Styles UIkit and font awesome to public
gulp.task('styles', function() {
  return sass(config.sassPath + '/style.scss', { style:'compressed',
  loadPath: ['./resources/sass',
  config.bowerDir + '/uikit/scss',
  config.bowerDir + '/fontawesome/scss',]})
  .on("error",notify.onError(function(error) {
    return "Error: " + error.message;
  }))
  .pipe(gulp.dest('./public/css'))
  .pipe(livereload())
  .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
  .pipe(rename({ suffix: '.min' }))
  .pipe(minifycss())
  .pipe(notify({ message: 'Styles task complete' }));
});

// Images optimizing
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});


//javascript jquery and uikit concat
gulp.task('bundle', function() {
	var bundlejs = [
	'./bower_components/jquery/dist/jquery.min.js',
	'./bower_components/uikit/js/uikit.min.js'
	]
	return gulp.src(bundlejs)
		.pipe(concat('bundle.js'))
		.pipe(gulp.dest('./public/js'))
	});

//minify our javascript
gulp.task('scripts', function() {
    return gulp.src('./resources/js/*.js')
        .pipe(concat('all.js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'));
});

//jslint
gulp.task('lint', function() {
    return gulp.src('./resources/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


// Default task
gulp.task('default',  function() {
    gulp.start('styles','images', 'icons', 'bower', 'bundle', 'lint', 'scripts');

});

// Sass Watch and images watch
gulp.task('watch', function() {

  var server = livereload();
  // Watch .scss files
  gulp.watch(config.sassPath + '/**/*.scss', ['styles']);
  // Watch image files
  gulp.watch('./resources/images/**/*', ['images']);
  // Watch jslint
  gulp.watch('./resources/js/*.js', ['lint', 'scripts']);

  // Create LiveReload server

  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch(['./resources/**']).on('change', livereload.changed);

});
