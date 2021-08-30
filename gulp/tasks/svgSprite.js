const gulp = require('gulp')
const svgstore = require('gulp-svgstore')
const svgmin = require('gulp-svgmin')
const rename = require('gulp-rename')

module.exports = function svgSprite() {
  return gulp.src('src/images/sprite/*.svg')
    .pipe(svgmin({
      plugins: [{
          removeDoctype: true
      }, { removeAttrs: {
              // attrs: '*:(stroke|fill):((?!^none$).)*'
          }
      }, {
          removeComments: true
      }, {
          removeTitle: true
      }, {
          convertColors: {
              names2hex: false,
              rgb2hex: false
          }
      }]
    }))
    .pipe(rename({prefix: 'icon-'}))
    .pipe(svgstore())
    .pipe(gulp.dest('build/images'))
    .pipe(gulp.dest('src/images'))
}

