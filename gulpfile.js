import gulp from 'gulp';
import gsass from 'gulp-sass';
import csso from 'gulp-csso';
import include from 'gulp-file-include';
import htmlmin from 'gulp-htmlmin';
import nodeSass from 'node-sass';
import { deleteAsync } from 'del';
import sync from 'browser-sync';
import ap from 'gulp-autoprefixer';
import concat from 'gulp-concat';
import jsmin from 'gulp-minify';


const sass = gsass(nodeSass);
 
function html () {
	return gulp.src('src/**.html')
	.pipe(include({
		prefix: '@@'
	}))
	.pipe(htmlmin({
		collapseWhitespace: true
	}))
	.pipe(gulp.dest('dist'));
}

function scss () {
	return gulp.src('src/scss/**.scss')
		.pipe(sass())
		.pipe(ap({
			browsers: ['last 2 versions']
		}))
		.pipe(csso())
		.pipe(concat('index.css'))
		.pipe(gulp.dest('dist'));
}

function script () {

	const jq = gulp.src(['node_modules/jquery/dist/jquery.min.js', 'src/**.js']);

	return gulp.src(['node_modules/jquery/dist/jquery.min.js', 'src/**.js'])
	  .pipe(concat('main.js'))
	  .pipe(jsmin({noSource: true}))
	  .pipe(gulp.dest('dist'))
  }

async function clear () {
	return await deleteAsync('dist');
}

function serve () {
	sync.init({
		server: './dist'
	 });

	gulp.watch('src/**.html', gulp.series(html)).on('change', sync.reload);
	gulp.watch('src/scss/**.scss', gulp.series(scss)).on('change', sync.reload);
	gulp.watch('src/**.js', gulp.series(script)).on('change', sync.reload);
}

export async function build () {
	const task = gulp.series( clear, scss, html);
	await task();
}

export async function start () {
	const task = gulp.series(clear, scss, html, script, serve);
	await task();
}