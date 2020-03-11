let gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-cssmin'),
    htmlmin = require('gulp-htmlmin');

const cssFiles = [
	'app/css/libs.css',
	'app/css/style.css'
]

const jsFiles = [
	'app/js/libs.js',
	'app/js/main.js'
]

gulp.task('clean', async function(){
	del.sync('dist')
});

gulp.task('scss',function(){
	return gulp.src('app/scss/style.scss')
		.pipe(sass())
		// .pipe(sass({outputStyle: 'expanded'}))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 8 versions']
		}))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream:true}))
});

gulp.task('style', function(){
	return gulp.src([
			'node_modules/normalize.css/normalize.css',
			'node_modules/slick-carousel/slick/slick.css'
		])
	.pipe(concat('libs.css'))
	.pipe(gulp.dest('app/css'))
});

gulp.task('html',function(){
	return gulp.src('app/*.html')
	.pipe(browserSync.reload({stream:true}))
});

gulp.task('script',function(){
	return gulp.src('app/js/main.js')
	.pipe(browserSync.reload({stream:true}))
});

gulp.task('js', function(){
	return gulp.src([
			'node_modules/slick-carousel/slick/slick.js'
		])
	.pipe(concat('libs.js'))
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({stream:true}))
});


gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
});

gulp.task('export', function(){
	let buildHtml = gulp.src('app/**/*.html')
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest('dist'))
	let buildCss = gulp.src(cssFiles)
		.pipe(concat('style.min.css'))
		.pipe(cssmin())
		.pipe(gulp.dest('dist/css'))
	let buildJs = gulp.src(jsFiles)
		.pipe(concat('main.min.js'))
		.pipe(uglify({toplevel: true}))
		.pipe(gulp.dest('dist/js'))
	let buildFonts = gulp.src('app/fonts/**/*.*')
		.pipe(gulp.dest('dist/fonts'))
	let buildImg = gulp.src('app/images/**/*.*')
		.pipe(gulp.dest('dist/images'))
});

gulp.task('watch',function(){
	gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'))
	gulp.watch('app/*.html', gulp.parallel('html'))
	gulp.watch('app/js/*.js', gulp.parallel('script'))
});

gulp.task('build', gulp.series('clean', 'export'));

gulp.task('default',gulp.parallel('style','scss','js','browser-sync', 'build', 'watch'))