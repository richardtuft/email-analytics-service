'use strict';

// Third party modules/dependencies
let gulp = require('gulp');
let mocha = require('gulp-mocha');
let jshint = require('gulp-jshint');
let istanbul = require('gulp-istanbul');


// Paths
let files =  {
    server: ['server.js'],
    worker: ['worker.js'],
    mochaTests: ['./tests/**/*.js'],
    appSrc: ['./app/**/*.js']
};

gulp.task('setTestEnv', function () {
    process.env.NODE_ENV = 'test';
});

gulp.task('lint', () => {

    let allFiles = files.appSrc
       .concat(files.mochaTests)
       .concat(files.worker)
       .concat(files.server);

    return gulp.src(allFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('istanbul', () => {

    let allFiles = files.appSrc
        .concat(files.mochaTests)
        .concat(files.worker)
        .concat(files.server);

    gulp.src(allFiles)
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on('finish', () => {
            gulp.src(files.mochaTests)
                .pipe(mocha())
                .pipe(istanbul.writeReports({
                        reporters: [ 'lcov', 'json', 'text', 'text-summary']
                })) // Creating the reports after tests
                .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } })) // Enforce a coverage of at least 90%
                .once('error', function () {
                     process.exit(1);
                 })
                .once('end', function () {
                    process.exit();
                });
        });
});

gulp.task('test', ['setTestEnv', 'lint', 'istanbul']);