'use strict';
/* eslint-env node */
var fs = require('fs');
var gulp = require('gulp');
var concat = require('gulp-concat');
var rollup = require('rollup');
var debug = require('gulp-debug');
var inject = require('gulp-inject');
var plumber = require('gulp-plumber');
var terser = require('gulp-terser');
var rollupResolve = require('rollup-plugin-node-resolve');
var rollupBabel = require('rollup-plugin-babel');
var eslint = require('gulp-eslint');

gulp.task('lint', function() {
  return gulp
    .src(['*.jscad', 'gulpfile.js'])
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format());
  // .pipe(eslint.failAfterError());
});

gulp.task('build', async function() {
  const bundle = await rollup.rollup({
    input: './src/index.js',
    external: ['@jscad/scad-api', '@jscad/csg'],
    plugins: [
      rollupResolve({
        customResolveOptions: {
          moduleDirectory: 'node_modules'
        },
        browser: true
      }),
      rollupBabel({
        exclude: 'node_modules/**' // only transpile our source code
      })
    ]
  });

  await bundle.write({
    name: 'jscadUtils',
    file: 'dist/index.js',
    format: 'iife',
    exports: 'named',
    globals: { '@jscad/csg': 'jsCadCSG', '@jscad/scad-api': 'scadApi' }
  });
});

gulp.task('examples', function() {
  return gulp
    .src('examples/*.jscad')
    .pipe(plumber())
    .pipe(
      inject(
        gulp
          .src(['dist/compat.js'])
          .pipe(
            terser({
              ecma: 6,
              keep_fnames: true,
              mangle: false,
              compress: false,
              output: {
                beautify: true,
                max_line_len: 80
              }
            })
          )
          .pipe(debug({ title: 'injecting:' })),
        {
          relative: true,
          starttag: '// include:js',
          endtag: '// endinject',
          transform: function(filepath, file) {
            console.log('file', file.base, file.history);
            return '// ' + filepath + '\n' + file.contents.toString('utf8');
          }
        }
      )
    )
    .pipe(gulp.dest('dist/examples'));
});

gulp.task('v1compat', function() {
  return gulp
    .src('src/compat.js')
    .pipe(plumber())
    .pipe(
      inject(gulp.src('dist/index.js'), {
        relative: true,
        starttag: '// include:compat',
        endtag: '// endinject',
        transform: function(filepath, file) {
          return '// ' + filepath + '\n' + file.contents.toString('utf8');
        }
      })
    )
    .pipe(gulp.dest('dist'));
});

gulp.task('all', gulp.series(['build', 'v1compat', 'examples']));

gulp.task(
  'default',
  gulp.series(['build', 'v1compat', 'examples'], function() {
    gulp.watch(
      ['src/**/*.js', 'examples/*.jscad'],
      {
        verbose: true,
        followSymlinks: true,
        delay: 500,
        queue: false,
        ignoreInitial: false,
        ignored: ['**/*.*~', 'dist/*', '.vuepress/*']
      },
      gulp.series(['build', 'v1compat', 'examples'])
    );
  })
);
