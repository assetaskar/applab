const appFolder = "app/",
	distFolder = "dist/";

const path = {
	build: {
		html: distFolder,
		css: distFolder + "css/",
		img: distFolder + "img/",
		js: distFolder + "js/",
	},
	src: {
		html: [appFolder + "*.html", "!" + appFolder + "_*.html"],
		css: appFolder + "scss/style.scss",
		img: appFolder + "img/**/*",
		js: appFolder + "js/script.js",
	},
	watch: {
		html: appFolder + "*.html",
		css: appFolder + "scss/**/*.scss",
		img: appFolder + "img/**/*",
		js: appFolder + "js/**/*.js",
	},
	clean: [distFolder + "**/*", "!dist/libs"],
};

const { src, dest, parallel, series, watch } = require("gulp"),
	browsersync = require("browser-sync").create(),
	fileInclude = require("gulp-file-include"),
	del = require("del"),
	scss = require("gulp-sass"),
	autoprefixer = require("gulp-autoprefixer"),
	groupMedia = require("gulp-group-css-media-queries"),
	cleanCSS = require("gulp-clean-css"),
	rename = require("gulp-rename"),
	uglify = require("gulp-uglify-es").default,
	imagemin = require("gulp-imagemin"),
	webp = require("gulp-webp"),
	webpHTML = require("gulp-webp-html"),
	newer = require("gulp-newer");

function browserSync() {
	browsersync.init({
		server: {
			baseDir: distFolder,
		},
		notify: false,
	});
}

function html() {
	return src(path.src.html)
		.pipe(fileInclude())
		.pipe(webpHTML())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream());
}

function css() {
	return src(path.src.css)
		.pipe(
			scss({
				outputStyle: "expanded",
			}).on("error", scss.logError)
		)
		.pipe(groupMedia())
		.pipe(
			autoprefixer({
				overrideBrowserslist: ["last 5 versions, not dead"],
				cascade: true,
				grid: true,
			})
		)
		.pipe(dest(path.build.css))
		.pipe(cleanCSS())
		.pipe(
			rename({
				extname: ".min.css",
			})
		)
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream());
}

function js() {
	return src(path.src.js)
		.pipe(fileInclude())
		.pipe(dest(path.build.js))
		.pipe(uglify())
		.pipe(
			rename({
				extname: ".min.js",
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream());
}

function images() {
	return src(path.src.img)
		.pipe(
			webp({
				quality: 80,
			})
		)
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		.pipe(newer(path.build.img))
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [{ removeViewBox: false }],
				interlaced: true,
				optimizationLevel: 3,
			})
		)
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream());
}

function startWatch() {
	watch(path.watch.html, html);
	watch(path.watch.css, css);
	watch(path.watch.js, js);
	watch(path.watch.img, images);
}

function clean() {
	return del(path.clean);
}

exports.images = images;
exports.clean = clean;
exports.build = series(clean, parallel(html, css, js, images));
exports.default = series(clean, parallel(html, css, js, images), parallel(startWatch, browserSync));
exports.race = parallel(startWatch, browserSync);
