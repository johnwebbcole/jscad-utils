'use strict';
/* eslint-env node */
var fs = require('fs');
var gulp = require('gulp');
// var concat = require('gulp-concat');
var del = require('del');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();
// var runSequence = require('run-sequence');
var rollup = require('rollup');

gulp.task('clean', function (done) {
    del(['README.md', 'dist/jscad-utils.js']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n')); // eslint-disable-line no-console, no-undef
        done();
    });
});

gulp.task('lint', function () {
    return gulp.src(['*.jscad', 'gulpfile.js'])
        .pipe(plugins.plumber())
        .pipe(plugins.eslint())
        .pipe(plugins.eslint.format());
    // .pipe(plugins.eslint.failAfterError());
});

gulp.task('docs', function () {
    return gulp.src('*.jscad')
        .pipe(plugins.plumber())
        .pipe(plugins.concat('README.md'))
        .pipe(plugins.jsdocToMarkdown({
            template: fs.readFileSync('./jsdoc2md/README.hbs', 'utf8')
        }))
        .on('error', function (err) {
            plugins.util.log('jsdoc2md failed:', err.message);
        })
        .pipe(gulp.dest('.'));
});

gulp.task('build', function () {
    return gulp.src('*.jscad')
        .pipe(plugins.plumber())
        .pipe(plugins.concat('utils.jscad'))
        .pipe(gulp.dest('dist'));
});

gulp.task('examples', ['build'], function () {
    return gulp.src('examples/*.jscad')
        .pipe(plugins.plumber())
        .pipe(plugins.inject(
            gulp.src('dist/utils.jscad'), {
                relative: true,
                starttag: '// include:js',
                endtag: '// endinject',
                transform: function (filepath, file) {
                    return '// ' + filepath + '\n' + file.contents.toString('utf8');
                }
            }))
        .pipe(gulp.dest('dist'));
});

gulp.task('all', ['docs', 'lint', 'build', 'examples']);

gulp.task('default', ['all'], function () {
    gulp.watch(['*.jscad', 'examples/*.jscad', 'jsdoc2md/README.hbs', 'node_modules/'], {
        verbose: true,
        followSymlinks: true
    }, ['all']);
});
