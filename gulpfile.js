const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');

const srcPath = './public_src';
const destPath = './public';

// SCSS

gulp.task('scss', () => (
  gulp.src(`${srcPath}/scss/**/*.scss`)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`${destPath}/css`))
));

gulp.task('scss:watch', ['scss'], () => {
  gulp.watch(`${srcPath}/scss/**/*.scss`, ['scss']);
});

// FONTS

const fontFiles = [
  './node_modules/bootstrap-sass/assets/fonts/bootstrap/*.*',
  './node_modules/font-awesome/fonts/*.*'
];

gulp.task('fonts', () => (
  gulp.src(fontFiles)
    .pipe(gulp.dest(`${destPath}/fonts`))
));

gulp.task('fonts:watch', ['fonts'], () => {
  gulp.watch(fontFiles, ['fonts']);
})

// JS

const jsCommonFiles = [
  './node_modules/jquery/dist/jquery.min.js',
  './node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js',
  './node_modules/moment/min/moment.min.js',
  './node_modules/moment/locale/th.js',
  './node_modules/chart.js/dist/Chart.min.js',
  './node_modules/datatables.net/js/jquery.dataTables.js',
  './node_modules/datatables.net-bs/js/dataTables.bootstrap.js'
];
const jsFiles = `${srcPath}/js/**/*.js`;

gulp.task('js:common', () => (
  gulp.src(jsCommonFiles)
    .pipe(concat('common.js'))
    .pipe(gulp.dest(`${destPath}/js`))
));

gulp.task('js:copy', () => (
  gulp.src(jsFiles)
    .pipe(gulp.dest(`${destPath}/js`))
));

gulp.task('js:watch', ['js:common', 'js:copy'], () => {
  gulp.watch(jsCommonFiles, ['js:common']);
  gulp.watch(jsFiles, ['js:copy']);
});

// OTHERS

gulp.task('img:copy', () => (
  gulp.src(`${srcPath}/img/**/*.*`)
    .pipe(gulp.dest(`${destPath}/img`))
));

gulp.task('img:watch', ['img:copy'], () => {
  gulp.watch(jsFiles, ['img:copy']);
});

// ALL

gulp.task('watch', ['scss:watch', 'js:watch', 'fonts:watch', 'img:watch']);