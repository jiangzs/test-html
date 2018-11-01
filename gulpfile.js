'use strict';

// Core references for this to work
var gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  sass = require('gulp-sass'),
  csso = require('gulp-csso'),
  sourcemaps = require('gulp-sourcemaps'),
  reload = browserSync.reload,
  clean = require('gulp-clean'),
  autoprefixer = require('autoprefixer'),
  htmlminify = require("gulp-html-minify"),
  runSequence = require('run-sequence'),
  uglify = require('gulp-uglify');
// var listing of files for dist build
var filesToDist = [
  './src/*.html',
  './src/css/**/*.*',
  './src/images/**/*.*',
  './src/js//**/*.js'
];


// Use for stand-alone autoprefixer
var gulpautoprefixer = require('gulp-autoprefixer');

// alternate vars if you want to use Postcss as a setup
var postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer');

// Gulp task when using gulp-autoprefixer as a standalone process
gulp.task('build:css', function() {
  gulp.src('./src/sass/{,*/}*.{scss,sass}')
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'expanded' //alt options: nested, compact, compressed
    }))
    .pipe(gulpautoprefixer({
      browsers: ['last 4 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./src/css'))
    .pipe(reload({stream: true}));
});

// Static Server + watching scss/html files
gulp.task('serve', ['build:css'], function() {

  browserSync.init({
    // server: "./src/",
    server: "./dist/",
    port: 8080
  });

  gulp.watch('./src/sass/{,*/}*.{scss,sass}', ['build:css']);
  gulp.watch("./src/*.html").on('change', browserSync.reload);
});

// Sass watcher
gulp.task('sass:watch', function() {
  gulp.watch('./src/sass/{,*/}*.{scss,sass}', ['build:css'])
});


// Gulp task to minify CSS files
gulp.task('styles', function () {
  return gulp.src('./src/**/*.css')
  // Auto-prefix css styles for cross browser compatibility
  //   .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    // Minify the file
    .pipe(csso())
    // Output
    .pipe(gulp.dest('./dist'))
});

// Gulp task to minify JavaScript files
gulp.task('scripts', function() {
  return gulp.src('./src/**/*.js')
  // Minify the file
    .pipe(uglify())
    // Output
    .pipe(gulp.dest('./dist'))
});

// Gulp task to minify HTML files
gulp.task('pages', function() {
  return gulp.src("./src/**/*.html")
    .pipe(htmlminify())
    .pipe(gulp.dest("./dist"));
});

// Clean output directory
// resource cleaning task
gulp.task('clean', function(){
  return gulp.src(['dist/*'], {read:false})
    .pipe(clean());
});

// Gulp task to minify all files
gulp.task('dist', ['clean'], function () {
  runSequence(
    'styles',
    'scripts',
    'pages'
  );
});

// dist build tasks
// see var filesToDist for specific files
// gulp.task('build:dist',['clean'], function(){
//   // the base option sets the relative root for the set of files,
//   // preserving the folder structure
//   runSequence(
//     'default'
//   );
//   gulp.src(filesToDist, { base: './src/' })
//     .pipe(gulp.dest('dist'));
// });

// gulp.task('start', ['build:css', 'sass:watch', 'serve']);
