import gulp from 'gulp';
import fileInclude from 'gulp-file-include';
import htmlBeautify from 'gulp-html-beautify'
import browserSync from 'browser-sync';
import { deleteAsync } from 'del';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import webpackStream from 'webpack-stream';
import newer from 'gulp-newer';
import imagemin from 'gulp-imagemin';
import svgSprite from 'gulp-svg-sprite';
import * as nodePath from 'path';
const rootFolder = nodePath.basename(nodePath.resolve());

const buildFolder = './dist';
const srcFolder = './src';

const path = {
	build: {
		html: `${buildFolder}/`,
		css: `${buildFolder}/css/`,
		js: `${buildFolder}/js/`,
		img: `${buildFolder}/img/`,
	},
	src: {
		html: `${srcFolder}/*.html`,
		scss: `${srcFolder}/scss/style.scss`,
		js: `${srcFolder}/js/scripts.js`,
		img: [`${srcFolder}/img/**/*.{png,jpeg,jpg,svg,gif}`, `!${srcFolder}/img/sprites/*.svg`],
		sprite: `${srcFolder}/img/sprites/*.svg`,
	},
	watch: {
		html: `${srcFolder}/**/*.html`,
		scss: `${srcFolder}/**/*.scss`,
		js: `${srcFolder}/**/*.js`,
		img: [`${srcFolder}/img/**/*.{png,jpeg,jpg,svg,gif}`, `!${srcFolder}/img/sprites/*.svg`],
		sprite: `${srcFolder}/img/sprites/*.svg`,
	},
	reset: buildFolder,
	srcFolder: srcFolder,
	buildFolder: buildFolder,
	rootFolder: rootFolder,
};

const reset = () => {
	return deleteAsync(path.reset);
};

const html = () => {
	return gulp.src(path.src.html)
		.pipe(fileInclude({
			prefix: '@'
		}))
		.pipe(htmlBeautify())
		.pipe(gulp.dest(path.build.html))
		.pipe(browserSync.stream());
};

const scss = () => {
	return gulp
		.src(path.src.scss, { sourcemaps: true })
		.pipe(sass())
		.pipe(gulp.dest(path.build.css, { sourcemaps: true }))
		.pipe(browserSync.stream());
};

const js = () => {
	return gulp
		.src(path.src.js, { sourcemaps: true })
		.pipe(
			webpackStream({
				mode: 'production',
				output: {
					filename: 'build.js'
				},
			})
		)
		.pipe(gulp.dest(path.build.js, { sourcemaps: true }))
		.pipe(browserSync.stream());
};

const img = () => {
	return gulp
		.src(path.src.img)
		.pipe(newer(path.build.img))
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [{ removeViewBox: false }],
				interlaced: true,
				optimizationLevel: 3,
			})
		)
		.pipe(gulp.dest(path.build.img));
};

const sprite = () => {
	return gulp
		.src(path.src.sprite)
		.pipe(
			svgSprite({
				shape: {
					dimension: {
						maxWidth: '500',
						maxHeight: '500',
					},
					spacing: {
						padding: 0,
					},
					transform: [
						{
							svgo: {
								plugins: [{ removeViewBox: false }, { removeUnusedNS: false }, { removeUselessStrokeAndFill: true }, { cleanupIDs: false }, { removeComments: true }, { removeEmptyAttrs: true }, { removeEmptyText: true }, { collapseGroups: true }, { removeAttrs: { attrs: '(fill|stroke|style)' } }],
							},
						},
					],
				},
				mode: {
					symbol: {
						dest: '.',
						sprite: 'sprite.svg',
					},
				},
			})
		)
		.pipe(gulp.dest(path.build.img))
		.pipe(browserSync.stream());
};

function watcher() {
	gulp.watch(path.watch.html, html);
	gulp.watch(path.watch.scss, scss);
	gulp.watch(path.watch.js, js);
	gulp.watch(path.watch.img, img);
	gulp.watch(path.watch.sprite, sprite);
}

const server = () => {
	browserSync.init({
		server: {
			baseDir: path.build.html,
			index: 'index.html',
		},
		notify: false,
	});
};

const main = gulp.series(reset, gulp.parallel(html, scss, js, img, sprite), gulp.parallel(watcher, server));

gulp.task('default', main);
