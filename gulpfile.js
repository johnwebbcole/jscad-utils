'use strict'
var fs = require('fs')
var gulp = require('gulp')
var concat = require('gulp-concat')
var del = require('del');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

gulp.task('clean', function (done) {
    del(['README.md']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n')); // eslint-disable-line no-console, no-undef
        done();
    });
});


gulp.task('docs', function () {
    return gulp.src('*.jscad')
        .pipe(concat('README.md'))
        .pipe(plugins.jsdocToMarkdown({
            template: fs.readFileSync('./jsdoc2md/README.hbs', 'utf8')
        }))
        .on('error', function (err) {
            gutil.log('jsdoc2md failed:', err.message)
        })
})

gulp.task('default', ['clean', 'docs'], function () {
    plugins.watch(['!examples/*', '**/*.jscad', 'node_modules/'], {
        verbose: true,
        followSymlinks: true
    }, plugins.batch(function (events, done) {
        gulp.start('docs', done);
    }));
});
