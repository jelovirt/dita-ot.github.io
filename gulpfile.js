const gulp = require('gulp')
const babel = require('gulp-babel')
const watch = require('gulp-watch')
const index = require('./index')

gulp.task('default', ['js'])

gulp.task('js', () => {
  return gulp
    .src('_js/**/*.js')
    .pipe(babel({
      presets: ['es2015'],
      compact: true,
      comments: false
    }))
    .pipe(gulp.dest('js'))
})

gulp.task('index', () => {
  return gulp
    .src(['dev/**/*.html', '!dev/toc.html'])
    .pipe(index('/dev', 'index.json'))
    .pipe(gulp.dest('dev'))
})

gulp.task('watch-js', ['js'], () => {
  return watch('_js/**/*.js', () => {
    gulp.start('js')
  })
})
