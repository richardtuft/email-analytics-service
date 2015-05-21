'use strict';

let gulp = require('gulp');
let mocha = require('gulp-mocha');

gulp.task('test', () => {
    return gulp.src(['./tests/**/*.js'])
        .pipe(mocha());
});