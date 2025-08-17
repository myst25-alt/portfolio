const { src, dest, series, parallel } = require('gulp');
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.warn('Warning: sharp not available in this environment. Image resizing will be skipped.');
  sharp = null;
}
const through2 = require('through2');
const imagemin = require('gulp-imagemin');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const terser = require('gulp-terser');
const fs = require('fs');
const path = require('path');
const rename = require('gulp-rename');

// Paths
const paths = {
  images: ['**/assets/images/**/*.{jpg,jpeg,png,JPG,JPEG,PNG}'],
  html: ['**/*.html', '!node_modules/**', '!dist/**', '!gulpfile.js'],
  css: ['**/*.css', '!node_modules/**', '!dist/**'],
  js: ['**/*.js', '!node_modules/**', '!dist/**']
};

function clean() {
  const distPath = path.join(__dirname, 'dist');
  return fs.promises.rm(distPath, { recursive: true, force: true }).catch(() => {});
}

function images() {
  if (!sharp) {
    // Fallback: copy images as-is into dist preserving paths
    return src(paths.images, { base: './' })
      .pipe(dest('dist'));
  }

  return src(paths.images, { base: './' })
    .pipe(through2.obj(function (file, _, cb) {
      if (file.isNull()) return cb(null, file);
      if (file.isStream()) return cb(new Error('Streaming not supported'));

      const relPath = file.relative;
      const dir = file.base; 
      const sizes = [800, 1200];
      const tasks = [];

      sizes.forEach(size => {
        // resize to JPEG/PNG variant
        const outName = relPath.replace(/\.(jpe?g|png)$/i, `-${size}.$1`);
        tasks.push(
          sharp(file.contents)
            .resize({ width: size, withoutEnlargement: true })
            .jpeg({ quality: 85, progressive: true })
            .toBuffer()
            .then(buf => ({ path: outName, contents: buf }))
        );

        // webp variant
        const outWebp = relPath.replace(/\.(jpe?g|png)$/i, `-${size}.webp`);
        tasks.push(
          sharp(file.contents)
            .resize({ width: size, withoutEnlargement: true })
            .webp({ quality: 85 })
            .toBuffer()
            .then(buf => ({ path: outWebp, contents: buf }))
        );
      });

      Promise.all(tasks).then(results => {
        results.forEach(r => {
          const out = file.clone({ contents: false });
          out.path = require('path').join(file.base, r.path);
          out.contents = Buffer.from(r.contents);
          this.push(out);
        });
        cb();
      }).catch(err => {
        console.warn('sharp error - falling back to copying original image:', err.message || err);
        // on error, push original file through
        this.push(file);
        cb();
      });
    }))
  .pipe(dest('dist'));
}

function styles() {
  return src(paths.css, { base: './' })
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(dest('dist'));
}

function scripts() {
  return src(paths.js, { base: './' })
    .pipe(terser())
    .pipe(dest('dist'));
}

function markup() {
  return src(paths.html, { base: './' })
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(dest('dist'));
}

exports.clean = clean;
exports.images = images;
exports.styles = styles;
exports.scripts = scripts;
exports.markup = markup;

exports.build = series(clean, parallel(images, styles, scripts, markup));
exports.default = exports.build;
