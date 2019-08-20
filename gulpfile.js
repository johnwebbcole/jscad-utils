'use strict';
/* eslint-env node */
var fs = require('fs');
var gulp = require('gulp');
// var concat = require('gulp-concat');
var del = require('del');
// var gulpLoadPlugins = require('gulp-load-plugins');
// var plugins = gulpLoadPlugins();
// var runSequence = require('run-sequence');
var rollup = require('rollup');
var merge2 = require('merge2');
var debug = require('gulp-debug');
var inject = require('gulp-inject');
var plumber = require('gulp-plumber');
var terser = require('gulp-terser');
var rollupResolve = require('rollup-plugin-node-resolve');
var rollupBabel = require('rollup-plugin-babel');

// gulp.task('clean', function(done) {
//     del(['README.md', 'dist/jscad-utils.js']).then(paths => {
//         console.log('Deleted files and folders:\n', paths.join('\n')); // eslint-disable-line no-console, no-undef
//         done();
//     });
// });

// gulp.task('lint', function() {
//     return gulp
//         .src(['*.jscad', 'gulpfile.js'])
//         .pipe(plugins.plumber())
//         .pipe(plugins.eslint())
//         .pipe(plugins.eslint.format());
//     // .pipe(plugins.eslint.failAfterError());
// });

// gulp.task('docs', function() {
//     return gulp
//         .src('*.jscad')
//         .pipe(plugins.plumber())
//         .pipe(plugins.concat('README.md'))
//         .pipe(
//             plugins.jsdocToMarkdown({
//                 template: fs.readFileSync('./jsdoc2md/README.hbs', 'utf8')
//             })
//         )
//         .on('error', function(err) {
//             plugins.util.log('jsdoc2md failed:', err.message);
//         })
//         .pipe(gulp.dest('.'));
// });

// gulp.task('build', function() {
//     return gulp
//         .src('*.jscad')
//         .pipe(plugins.plumber())
//         .pipe(plugins.concat('utils.jscad'))
//         .pipe(gulp.dest('dist'));
// });

// gulp.task('examples', function() {
//     return gulp
//         .src('examples/*.jscad')
//         .pipe(plugins.plumber())
//         .pipe(
//             plugins.inject(gulp.src('dist/compat.js'), {
//                 relative: true,
//                 starttag: '// include:js',
//                 endtag: '// endinject',
//                 // transform: function(filepath, file) {
//                 //     return (
//                 //         '// ' + filepath + '\n' + file.contents.toString('utf8')
//                 //     );
//                 // }
//             })
//         )
//         .pipe(gulp.dest('dist/exmaples'));
// });

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

gulp.task('compatv1', function() {
  return gulp
    .src('v1/compat.js')
    .pipe(plumber())
    .pipe(
      inject(gulp.src('dist/index.js'), {
        relative: true,
        starttag: '// include:compat.js',
        endtag: '// endinject',
        transform: function(filepath, file) {
          return '// ' + filepath + '\n' + file.contents.toString('utf8');
        }
      })
    )
    .pipe(gulp.dest('dist'));
});

gulp.task('all', gulp.series(['build', 'compatv1', 'examples']));

// gulp.task('all', ['docs', 'lint', 'build', 'examples']);

// gulp.task('default', ['all'], function() {
//     gulp.watch(
//         ['*.jscad', 'examples/*.jscad', 'jsdoc2md/README.hbs', 'node_modules/'],
//         {
//             verbose: true,
//             followSymlinks: true
//         },
//         ['all']
//     );
// });
