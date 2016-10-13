import gulp from 'gulp'
import connect from 'gulp-connect'
import plumber from 'gulp-plumber'
import rimraf from 'gulp-rimraf'
import cache from 'gulp-cached'
import remember from 'gulp-remember'
import ts from 'gulp-typescript'
import sourcemaps from 'gulp-sourcemaps'
import fs from 'fs'

const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json'))
const paths = {
  dev: './dev',
  src: './dev/**/*',
  release: './release',
  views: ['./dev/*.html', './dev/views/**/*.html', './dev/components/**/*.html'],
  styles: './dev/styles/**/*.css',
  scripts: ['./dev/scripts/**/*.js', './dev/views/**/*.js', './dev/components/**/*.js'],
  typescripts: [
    './typings/**/*.ts',
    './dev/typescripts/definitions/static/mediator.d.ts',
    './dev/typescripts/src/**/*.ts'
  ]
}
paths.typescripts = tsconfig['filesGlob']

const plumberConfig = {
  errorHandler: function (err) {
    console.log(err)
    this.emit('end')
  }
}
export function livereload (cb) {
  connect.server({
    root: paths.dev,
    livereload: true
  })
  cb()
}
const views = () => gulp.src(paths.views, { read: false })
      .pipe(plumber(plumberConfig))
      .pipe(cache('views'))
      .pipe(connect.reload())
      // .pipe(remember('views'))
const styles = () => gulp.src(paths.styles, { read: false })
      .pipe(plumber(plumberConfig))
      .pipe(cache('styles'))
      .pipe(connect.reload())
      // .pipe(remember('scripts'))
const scripts = () => gulp.src(paths.scripts, { read: false })
      .pipe(plumber(plumberConfig))
      .pipe(cache('scripts'))
      .pipe(connect.reload())
      // .pipe(remember('scripts'))
export function watch (cb) {
  gulp.watch([paths.views], gulp.series(views)).on('change', function (event) {
    if (event.type !== 'deleted') return
    delete cache.caches['views'][event.path]
    remember.forget('views', event.path)
  })
  gulp.watch([paths.styles], gulp.series(styles)).on('change', function (event) {
    if (event.type !== 'deleted') return
    delete cache.caches['styles'][event.path]
    remember.forget('styles', event.path)
  })
  gulp.watch([paths.scripts], gulp.series(scripts)).on('change', function (event) {
    if (event.type !== 'deleted') return
    delete cache.caches['scripts'][event.path]
    remember.forget('scripts', event.path)
  })
  cb()
}
const clear = () => gulp.src(paths.release, { read: false, allowEmpty: true })
    .pipe(rimraf({ force: true }))
const copy = () => gulp.src(paths.src).pipe(gulp.dest(paths.release))
const tsproject = ts.createProject('tsconfig.json')
const typescripts = () => gulp.src(paths.typescripts)
        .pipe(plumber(plumberConfig))
        .pipe(cache('typescripts'))
        .pipe(sourcemaps.init())
        .pipe(ts(tsproject)).js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dev/typescripts/dist'))
        // .pipe(remember('typescripts'))
export { typescripts }

const develop = gulp.task('default', gulp.series(livereload, watch))
export { develop }
const release = gulp.task('release', gulp.series(clear, copy))
export { release }
export default release
