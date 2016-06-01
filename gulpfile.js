var gulp = require('gulp'),
    print = require('gulp-print')
    babel = require('gulp-babel')
    webserver = require('gulp-webserver');

gulp.task('puny-human', function() {
    console.log('Puny humaaaan');
});

gulp.task('js', function() {
  return gulp.src('src/**/*.js')
    .pipe(print())
    .pipe(babel({
        presets: ['es2015', 'stage-1']
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('libs', function(){
  return gulp.src([
    'node_modules/lodash/lodash.js',
    'node_modules/systemjs/dist/system.js',
    'node_modules/babel-polyfill/dist/polyfill.js'])
    .pipe(print())
    .pipe(gulp.dest('build/libs'));
});

gulp.task('build', ['js', 'libs'], function(){
  return gulp.src(['src/**/*.html', 'src/**/*.css'])
    .pipe(print())
    .pipe(gulp.dest('build'));
});

gulp.task('watch', ['build'], function() {
  return gulp.watch('src/**/*', ['build']);
});

gulp.task('serve', ['watch'], function() {
  gulp.src('build')
    .pipe(webserver({
      fallback: 'index.html',
      open: true,
      livereload: true,
      directoryListing: false
    }));
});

gulp.task('default', ['build']);
