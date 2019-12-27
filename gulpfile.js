var gulp = require('gulp');
// var cleanCSS = require('gulp-clean-css');
var rev = require('gulp-rev');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var del = require('del');

var paths = {
    styles: {
        src: 'assets/css/*.css',
        dest: 'build/css'
    },
    scripts: {
        src_mif: [
            'assets/js/charts/*.js',
            'assets/js/mif/*.js',
            'assets/js/manager/*.js',
            'assets/js/settings/*.js',
            'assets/js/accounts/*.js',
            'assets/js/mif/reports/*.js'],
        dest: 'build/js'
    }
};

/* Not all tasks need to use streams, a gulpfile is just another node program
 * and you can use all packages available on npm, but it must return either a
 * Promise, a Stream or take a callback and call it
 */
function clean() {
    // You can use multiple globbing patterns as you would with `gulp.src`,
    // for example if you are using del 2.0 or above, return its promise
    return del(['build/js/*.js']);
}

/*
 * Define our tasks using plain functions
 */
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(cleanCSS())
        // pass in options to the stream
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest));
}

function mif_scripts() {
    return gulp.src(paths.scripts.src_mif, { sourcemaps: true })
        .pipe(uglify())
        .pipe(concat('bundle-mif.min.js'))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(rev()) //rename the files with hashes
        .pipe(gulp.dest(paths.scripts.dest)) //save the files with hashes
        .pipe(rev.manifest('build/js/rev-manifest.json', {
            merge: true //override the rev-manifest.json if one exists.
        }))
        .pipe(gulp.dest(paths.scripts.dest));//save the rev-manifest.json;
}

function watch() {
    gulp.watch(paths.scripts.src_mif, mif_scripts);
    //   gulp.watch(paths.styles.src, styles);
}

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.series(clean, gulp.parallel(mif_scripts));

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.clean = clean;
// exports.styles = styles;
exports._mif_scripts = mif_scripts;
exports.watch = watch;
exports.build = build;
/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = build;