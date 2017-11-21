// Required Plugins
const gulp = require('gulp'),
    imagemin     = require('gulp-imagemin'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer'),
    notify = require('gulp-notify'),
    del = require('del'),
    runSequence = require('run-sequence'),
    concat = require('gulp-concat');

//audio component variables
const dist = './dist/',
    src = './src/',
    jsSrc = src + 'js/*.js',
    jsVendorSrc = src + 'js/vendor/*js',
    jsDist = dist + 'js/',
    scssSrc = src + 'scss/*.scss',
    cssDist = dist + 'css/',
    imgSrc = src + 'img/*',
    imgDest = dist + 'img/',
    distSrc = dist + '**/*';


function handleErrors(error) {
    notify().write(error);
    console.log(error);
    process.exit(1);
}

// Compile Sass for Development and Production
// Autoprefixes browser prefixes
gulp.task('sass', function() {
    return gulp.src(scssSrc)
        .pipe(sourcemaps.init())
        // .pipe(gulpif(isProd, sourcemaps.init()))
        .pipe(sass({
            sourceComments : 'map',
            outputStyle: 'nested'
        }))
        .on('error', handleErrors)
        .pipe(postcss([autoprefixer({
            browsers: ['last 2 versions']
        })]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(cssDist));
});

// Move and compress images
gulp.task('imgProcess', function() {
    gulp.src(imgSrc)
        .pipe(imagemin())
        .pipe(gulp.dest(imgDest));
});


// Move and compress JavaScript
gulp.task('js', function() {
    gulp.src([ jsVendorSrc , jsSrc])
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(jsDist));
});


// Clean up desitination directory
gulp.task('clean', function() {
    return del([dist]);
});

gulp.task('dist_copy', ['sass', 'js'], function() {
   gulp.src(distSrc)
       .pipe(gulp.dest('../dest/audio_component/dist/'));
});

// Files are automatically watched
gulp.task('watch', function() {
    gulp.watch(scssSrc, ['sass', 'dist_copy']);
    gulp.watch([jsSrc], ['js', 'dist_copy']);
});

// Gulp development task
gulp.task('dev', ['clean', ], function(cb) {
    cb = cb || function() {};
    return runSequence(['sass', 'js', 'imgProcess', 'dist_copy'], 'watch', cb);
});
