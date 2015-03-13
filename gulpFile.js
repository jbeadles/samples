var gulp = require('gulp');
var del = require('del');
var react = require('gulp-react');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');
var stylus = require('gulp-stylus');
var minifycss = require('gulp-minify-css');

gulp.task('clean:dist', function() {
    del(['./dist/*']);
});

gulp.task('javascript', function() {
    gulp.src(['public/javascript/*.js', '!public/javascript/*.min.js'])
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/javascript/'));

});

gulp.task('browserify', function() {
    return gulp.src('components/**/*.js')
        .pipe(browserify({transform: ['reactify']}))
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest('public/javascript/'))
        .pipe(gulp.dest('dist/javascript/'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/javascript/'))
        .pipe(gulp.dest('dist/javascript/'));
});

gulp.task('browserify:app', function() {
    return gulp.src('app.js')
        .pipe(browserify({transform: ['reactify']}))
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest('public/javascript'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/javascript'))
});

gulp.task('stylesheets', function() {
    gulp.src(['public/stylesheets/*.styl', '!public/stylesheets/_*.styl'])
        .pipe(stylus())
        .pipe(gulp.dest('public/stylesheets'))
        .pipe(minifycss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/stylesheets'));

    gulp.src('public/stylesheets/scout/scout.styl')
        .pipe(stylus())
        .pipe(gulp.dest('public/stylesheets'))
        .pipe(minifycss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('vendor', function() {
    var publicDir = './public/vendor';

    gulp.src(publicDir + '/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('./public/vendor'));

    gulp.src(publicDir + '/jquery/dist/jquery.min.map')
        .pipe(gulp.dest('./public/vendor'));

    gulp.src(publicDir + '/lemonade/css/lemonade.css')
        .pipe(gulp.dest('./public/vendor'));
});

gulp.task('default', ['clean:dist'], function() {
    gulp.start('browserify', 'stylesheets', 'javascript');
    return gulp.start('deploy');
});

gulp.task('deploy', ['clean:dist','vendor'], function() {
    // move javascript files to dist for production
    gulp.src('public/javascript/**/*.js')
        .pipe(gulp.dest('dist/javascript/'));

    // move stylesheets fo dist for production
    gulp.src('public/css/**/*.css')
        .pipe(gulp.dest('dist/stylesheets/'));

    // move vendor files to dist for production
    gulp.src(['public/vendor/*.js','public/vendor/*.css'])
        .pipe(gulp.dest('dist/vendor/'));
});

gulp.task('watch', function() {
    var watching = false;
    gulp.start('stylesheets', function() {
        // Protect against this function being called twice. (Bug?)
        if (!watching) {
            watching = true;

            // Watch for changes in frontend js and run the 'javascript' task
            // gulp.watch('public/**/*.js', ['javascript']);

            // Watch for .less file changes and re-run the 'styles' task
            gulp.watch('public/**/*.styl', ['stylesheets']);
        }
    });
});