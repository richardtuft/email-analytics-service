'use strict';

// Third party modules/dependencies
let gulp = require('gulp');
let mocha = require('gulp-mocha');
let jshint = require('gulp-jshint');

// Paths
let files =  {
    mochaTests: ['./tests/**/*.js'],
    appSrc: ['./app/**/*.js']
};


gulp.task('test', () => {
    return gulp.src(files.mochaTests)
        .pipe(mocha());
});

gulp.task('lint', function() {

    return gulp.src(files.appSrc.concat(files.mochaTests))
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});