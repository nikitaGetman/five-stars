const gulp = require('gulp')
const cleanCSS = require('gulp-clean-css')
const sourcemaps = require('gulp-sourcemaps')
const concat = require("gulp-concat")

module.exports = function libsStyles() {
  return gulp.src([
      'src/local_modules/normalize.css/normalize.css',
      'src/local_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.css',
      // 'src/local_modules/overlayscrollbars/css/OverlayScrollbars.min.css',
      'src/local_modules/rangeslider.js/dist/rangeslider.css',
      // 'src/local_modules/choices.js/public/assets/styles/choices.min.css',
      'src/local_modules/animate.css/animate.min.css',
      'src/dropdown.css',
      'src/local_modules/bootstrap-select/dist/css/bootstrap-select.min.css',
      'src/local_modules/owl.carousel/dist/assets/owl.carousel.min.css',
      'src/local_modules/owl.carousel/dist/assets/owl.theme.default.min.css',
    ])
    .pipe(sourcemaps.init())
    .pipe(cleanCSS({
      debug: true,
      compatibility: '*'
    }, details => {
      console.log(`${details.name}: Original size:${details.stats.originalSize} - Minified size: ${details.stats.minifiedSize}`)
    }))
    .pipe(concat('libs.min.css'))
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/css'))
    .pipe(gulp.dest('src/css'))
}

