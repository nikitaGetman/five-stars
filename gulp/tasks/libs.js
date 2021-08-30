const gulp = require('gulp')
const sourcemaps = require('gulp-sourcemaps')
const concat = require("gulp-concat")

module.exports = function libs() {
    return gulp.src([
            'src/local_modules/jquery/dist/jquery.min.js',
            'src/local_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js',
            // 'src/local_modules/overlayscrollbars/js/jquery.overlayScrollbars.min.js',
            'src/local_modules/jquery-lazy/jquery.lazy.min.js',
            //
            'src/local_modules/rangeslider.js/dist/rangeslider.min.js',
            // 'src/local_modules/choices.js/public/assets/scripts/choices.min.js',
            'src/local_modules/owl.carousel/dist/owl.carousel.min.js',
            'src/dropdown.js',
            'src/local_modules/bootstrap-select/dist/js/bootstrap-select.min.js',
            'src/local_modules/svg4everybody/dist/svg4everybody.min.js',
            'src/local_modules/wowjs/dist/wow.min.js',
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('libs.min.js'))
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js'))
}

