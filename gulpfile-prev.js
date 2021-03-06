/* 
* Automate task in minification and merging of all js files.
*/
var gulp = require('gulp');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var rev    = require('gulp-rev');
var rename = require('gulp-rename');
var del    = require('del');

//inject files to index.html
var series = require('stream-series'),
    inject = require('gulp-inject');

//To eliminate typing gulp command, rather use this method watcher task.
// gulp watch command
gulp.task('watch',function(){
	gulp.watch([
				'assets/js/charts/*.js',
				'assets/js/settings/*.js',
				'assets/js/accounts/*.js',
				'assets/js/mif/*.js',
				'assets/js/manager/*.js',
				'assets/js/mif/reports/*.js',
				'assets/js/inventory/*.js', 
				'assets/js/inventory/reports/*.js',
				'assets/js/inventory/settings/*.js',
				'assets/js/mrf/*.js', 
				'assets/js/mrf/settings/*.js',
				'assets/js/pm/*.js',
				'assets/js/pm/settings/*.js'],
				['rev-clean','pack-mif-js','pack-invnt-js','pack-mrf-js','pack-pm-js']); //run all task.

	gulp.watch(
				['build/js/*.js'],
				['inject-js']
			);

});


gulp.task('rev-clean', () =>
  del.sync('build/js/*.js')
);

//MIF
gulp.task('pack-mif-js',function(){
		return gulp.src([
				'assets/js/charts/*.js',
				'assets/js/mif/*.js',
				'assets/js/manager/*.js',
				'assets/js/settings/*.js',
				'assets/js/accounts/*.js',
				'assets/js/mif/reports/*.js' ])
				.pipe(concat('bundle-mif.min.js')) // combine
				.pipe(minify({
					ext: {
						min: '.js'
					},
					noSource: true
				}))
				.pipe(rename({ //base and dest.
					dirname: 'build/js'
				}))
				.pipe(rev()) //rename the files with hashes
				.pipe(gulp.dest('./')) //save the files with hashes
				.pipe(rev.manifest('build/js/rev-manifest.json',{
					merge: true //override the rev-manifest.json if one exists.
				}))
				.pipe(gulp.dest('.'));//save the rev-manifest.json
				//.pipe(gulp.dest('build/js'));

});

//Inventory
gulp.task('pack-invnt-js',function(){
		return gulp.src([
				'assets/js/inventory/*.js', 
				'assets/js/inventory/reports/*.js', 
				'assets/js/inventory/settings/*.js'])
				.pipe(concat('bundle-invent.min.js'))
				.pipe(minify({
					ext: {
						min: '.js'
					},
					noSource: true
				}))
				.pipe(rename({ //base and dest.
					dirname: 'build/js'
				}))
				.pipe(rev()) //rename the files with hashes
				.pipe(gulp.dest('./')) //save the files with hashes
				.pipe(rev.manifest('build/js/rev-manifest.json',{
					merge: true //override the rev-manifest.json if one exists.
				}))
				.pipe(gulp.dest('.'));//save the rev-manifest.json
				// .pipe(gulp.dest('build/js'));

});
//MRF
gulp.task('pack-mrf-js',function(){
		return gulp.src([
				'assets/js/mrf/*.js', 
				'assets/js/mrf/settings/*.js'])
				.pipe(concat('bundle-mrf.min.js'))
				.pipe(minify({
					ext: {
						min: '.js'
					},
					noSource: true
				}))
				.pipe(rename({ //base and dest.
					dirname: 'build/js'
				}))
				.pipe(rev()) //rename the files with hashes
				.pipe(gulp.dest('./')) //save the files with hashes
				.pipe(rev.manifest('build/js/rev-manifest.json',{
					merge: true //override the rev-manifest.json if one exists.
				}))
				.pipe(gulp.dest('.'));//save the rev-manifest.json
				//.pipe(gulp.dest('build/js'));

});

//PM
gulp.task('pack-pm-js',function(){
		return gulp.src([
				'assets/js/pm/*.js',
				'assets/js/pm/settings/*.js'])
				.pipe(concat('bundle-pm.min.js'))
				.pipe(minify({
					ext: {
						min: '.js'
					},
					noSource: true
				}))
				.pipe(rename({ //base and dest.
					dirname: 'build/js'
				}))
				.pipe(rev()) //rename the files with hashes
				.pipe(gulp.dest('./')) //save the files with hashes
				.pipe(rev.manifest('build/js/rev-manifest.json',{
					merge: true //override the rev-manifest.json if one exists.
				}))
				.pipe(gulp.dest('.'));//save the rev-manifest.json
				//.pipe(gulp.dest('build/js'));

});

//rebuilding index.html with gulp-inject
gulp.task('inject-js',function(){ 
	 gulp.src('index.html')
		  .pipe(inject( 
		  			gulp.src('build/js/*.js',{read:false}),
		  				{addRootSlash: false} 
		  			 )
		  		) // This will always inject vendor files before app files
		  .pipe(gulp.dest('.'));


});


gulp.task('default',['watch']);