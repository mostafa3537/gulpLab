const gulp = require("gulp");
const { src, dest, watch, parallel, series } = require("gulp");


//html
const htmlmin = require("gulp-htmlmin");
function copyHtml() {
  return src("project/*.html")
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest("production"));
}

exports.html = copyHtml;

//minify css files and copy it to dist folder

var cleanCss = require("gulp-clean-css");
const concat = require("gulp-concat");
const terser = require("gulp-terser");

function cssMinify() {
  return (
    src("project/css/*.css")
      //concate all css files in style.min.css
      .pipe(concat("style.min.css"))
      //minify file
      .pipe(cleanCss())
      .pipe(dest("production/assets/css"))
  );
}
exports.css = cssMinify;

function jsMinify() {
  return (
    src("project/js/**/*.js", { sourcemaps: true }) //path includeing all js files in all folders
      //concate all js files in all.min.js
      .pipe(concat("all.min.js"))
      //use terser to minify js files
      .pipe(terser())
      //create source map file in the same directory
      .pipe(dest("production/assets", { sourcemaps: "." }))
  );
}
exports.js = jsMinify;

var browserSync = require("browser-sync");
function serve(cb) {
  browserSync({
    server: {
      baseDir: "production/",
    },
  });
  cb();
}

function reloadTask(done) {
  browserSync.reload();
  done();
}

//watch task
function watchTask() {
  watch("project/*.html", series(copyHtml, reloadTask));
  watch("production/assets", series(jsMinify, reloadTask));
  watch("production/assets/css", series(cssMinify, reloadTask));

}
exports.default = series(
  parallel(jsMinify /* , imgMinify */, cssMinify, copyHtml),
  serve,
  watchTask
);