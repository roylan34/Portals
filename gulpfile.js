var gulp = require('gulp');
// var cleanCSS = require('gulp-clean-css');
var rev = require('gulp-rev');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var inject = require('gulp-inject');
var del = require('del');

var paths = {
    styles: {
        src: 'assets/css/*.css',
        dest: 'build/css'
    },
    scripts: {
        dest: 'build/js',
        src_mif: [
            'assets/js/charts/*.js',
            'assets/js/mif/*.js',
            'assets/js/manager/*.js',
            'assets/js/settings/*.js',
            'assets/js/accounts/*.js',
            'assets/js/mif/reports/*.js'],
        src_invt: [
            'assets/js/inventory/*.js',
            'assets/js/inventory/reports/*.js',
            'assets/js/inventory/settings/*.js'],
        src_pm: [
            'assets/js/pm/*.js',
            'assets/js/pm/settings/*.js'],
        src_mrf: [
            'assets/js/mrf/*.js',
            'assets/js/mrf/settings/*.js']
    }
};

/* Not all tasks need to use streams, a gulpfile is just another node program
 * and you can use all packages available on npm, but it must return either a
 * Promise, a Stream or take a callback and call it
 */
function clean() {
    // You can use multiple globbing patterns as you would with `gulp.src`,
    // for example if you are using del 2.0 or above, return its promise
    return del(['build/js/*.js', 'build/js/rev-manifest.json']);
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
        .pipe(rev()) //rename the files with hashes
        .pipe(gulp.dest(paths.scripts.dest)) //save the files with hashes
        .pipe(rev.manifest('build/js/rev-manifest.json', {
            merge: true //override the rev-manifest.json if one exists.
        }))
        .pipe(gulp.dest('./'));//save the rev-manifest.json;
}

function invt_scripts() {
    return gulp.src(paths.scripts.src_invt, { sourcemaps: true })
        .pipe(uglify())
        .pipe(concat('bundle-invt.min.js'))
        .pipe(rev()) //rename the files with hashes
        .pipe(gulp.dest(paths.scripts.dest)) //save the files with hashes
        .pipe(rev.manifest('build/js/rev-manifest.json', {
            merge: true //override the rev-manifest.json if one exists.
        }))
        .pipe(gulp.dest('./'));//save the rev-manifest.json;
}

function pm_scripts() {
    return gulp.src(paths.scripts.src_pm, { sourcemaps: true })
        .pipe(uglify())
        .pipe(concat('bundle-pm.min.js'))
        .pipe(rev()) //rename the files with hashes
        .pipe(gulp.dest(paths.scripts.dest)) //save the files with hashes
        .pipe(rev.manifest('build/js/rev-manifest.json', {
            merge: true //override the rev-manifest.json if one exists.
        }))
        .pipe(gulp.dest('./'));//save the rev-manifest.json;
}

function mrf_scripts() {
    return gulp.src(paths.scripts.src_mrf, { sourcemaps: true })
        .pipe(uglify())
        .pipe(concat('bundle-mrf.min.js'))
        .pipe(rev()) //rename the files with hashes
        .pipe(gulp.dest(paths.scripts.dest)) //save the files with hashes
        .pipe(rev.manifest('build/js/rev-manifest.json', {
            merge: true //override the rev-manifest.json if one exists.
        }))
        .pipe(gulp.dest('./'));//save the rev-manifest.json;
}

function inject_files() {
    return gulp.src('index.html')
        .pipe(inject(
            gulp.src('build/js/*.js', { read: false }),
            { addRootSlash: false }
        )) // This will always inject vendor files before app files
        .pipe(gulp.dest('.'));
}

function watch() {
    gulp.watch(
        paths.scripts.src_invt.concat(
            paths.scripts.src_pm,
            paths.scripts.src_mrf,
            paths.scripts.src_mif),
        gulp.series(clean, gulp.parallel(mif_scripts, invt_scripts, pm_scripts, mrf_scripts), inject_files));
    //   gulp.watch(paths.styles.src, styles);
}


/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.series(clean, gulp.parallel(mif_scripts, invt_scripts, pm_scripts, mrf_scripts), inject_files, watch);

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.clean = clean;
// exports.styles = styles;
// exports.inject = inject_files;
exports.watch = watch;
/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = build;