'use strict';

// Third party modules/dependencies
let gulp = require('gulp');
let mocha = require('gulp-mocha');
let jshint = require('gulp-jshint');
let istanbul = require('gulp-istanbul');


// Paths
let files =  {
    server: ['server.js'],
    mochaTests: ['./tests/**/*.js'],
    appSrc: ['./app/**/*.js']
};

gulp.task('lint', () => {

    return gulp.src(files.appSrc.concat(files.mochaTests))
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('istanbul', (cb) => {
    gulp.src(files.appSrc.concat(files.server))
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on('finish', () => {
            gulp.src(files.mochaTests)
                .pipe(mocha())
                .pipe(istanbul.writeReports({
                        reporters: [ 'lcov', 'json', 'text', 'text-summary']
                })) // Creating the reports after tests
                .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } })) // Enforce a coverage of at least 90%
                .on('end', cb);
        });
});

gulp.task('test', ['istanbul', 'lint']);