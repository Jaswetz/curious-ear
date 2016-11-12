// Required Plugins
var gulp = require('gulp');
var styleguide   = require('sc5-styleguide');
var imagemin     = require('gulp-imagemin');
var svgSprite    = require('gulp-svg-sprite');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var notify = require('gulp-notify');
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var gulpif = require('gulp-if');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var isArray = require('isarray');
var htmlmin = require('gulp-html-minifier');
var nunjucksRender = require('gulp-nunjucks-render');


// For production or development?
isProd = false;

// Variables for folder paths
sourceDir = './src/';
destDir = './dest/';
stylesSrc = sourceDir + 'styles/**/*.scss';
stylesDest = destDir + 'css/';
htmlSrc = sourceDir + '**/*.html';
htmlDest = destDir;
guideDest = destDir + 'styleguide/'
imgSrc = sourceDir + 'images/**/*';
imgDest = destDir + 'images';
svgSrc = sourceDir + 'svg';
svgDest = destDir + 'svg';
svgGlob = '**/*.svg'

// Define browser-sync ports
browserPort = 3000;
guidePort = 3002;
UIPort = 3003;

gulp.task('browserSync', function() {
    browserSync.init({
        server: destDir,
        port: browserPort,
        ui: {
            port: UIPort
        },
        ghostMode: {
            links: false
        }
    });

});

function handleErrors(error) {
    if (isProd = false) {
        notify().write(error);
        this.emit('end');
    } else {
        notify().write(error);
        console.log(error);
        process.exit(1);
    }
}

// Compile Sass for Development and Production
// Autoprefixes browser prefixes
gulp.task('sass', function() {
    return gulp.src(stylesSrc)
        .pipe(gulpif(isProd, sourcemaps.init()))
        .pipe(sass({
            sourceComments: isProd ? false : 'map',
            outputStyle: isProd ? 'compressed' : 'nested'
        }))
        .on('error', handleErrors)
        .pipe(postcss([autoprefixer({
            browsers: ['last 2 versions']
        })]))
        .pipe(gulpif(isProd, sourcemaps.write('.')))
        .pipe(gulp.dest(stylesDest))
        .pipe(gulpif(browserSync.active, browserSync.reload({
            stream: true
        })));
});

// Clean up desitination directory
gulp.task('clean', function() {
    return del([destDir]);
});

// Copy html to root directory
gulp.task('copyHtml', function() {
    gulp.src(htmlSrc)
        .pipe(gulpif(isProd, htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
        })))
    .pipe(gulp.dest(htmlDest))
        .pipe(gulpif(browserSync.active, browserSync.reload({
            stream: true
        })));
});

// Move and compress images
gulp.task('imgProcess', function() {
    gulp.src(imgSrc)
        .pipe(gulpif(isProd, imagemin()))
        .pipe(gulp.dest(imgDest))
});

// Create SVG Sprite
// https://github.com/jkphl/gulp-svg-sprite
gulp.task('svgSprite', function() {

    config = {
        "svg": {
          "namespaceClassnames": false
        },
        "shape": {
            "dest": "."
        },
        "mode": {
            "symbol": {
                "dest": ".",
                "sprite": "sprite.svg"
            }
        }
    };

    return gulp.src(svgGlob, {cwd: svgSrc})
        .pipe(gulpif(isProd, plumber()))
        .pipe(svgSprite(config)).on('error', function(error){ console.log(error); })
        .pipe(gulp.dest(svgDest))
        .pipe(notify({ message: 'SVG task complete' }));
});

// Style Guide
gulp.task('styleguide:generate', function() {
  return gulp.src(stylesSrc)
    .pipe(styleguide.generate({
        title: 'My Styleguide',
        server: true,
        port: guidePort,
        rootPath: guideDest,
        sideNav: true,
        overviewPath: 'README.md'
      }))
    .pipe(gulp.dest(guideDest));
});

gulp.task('styleguide:applystyles', function() {
  return gulp.src(stylesSrc + 'app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(styleguide.applyStyles())
    .pipe(gulp.dest(guideDest));
});

gulp.task('styleguide', ['styleguide:generate', 'styleguide:applystyles']);

// Files are automatically watched
gulp.task('watch', ['browserSync'], function() {
    gulp.watch(htmlSrc, ['copyHtml']);
    gulp.watch(stylesSrc, ['sass']);
    gulp.watch([stylesSrc], ['styleguide']);
});

// Gulp development task
gulp.task('dev', ['clean', ], function(cb) {
    cb = cb || function() {};
    isProd = false;
    return runSequence(['sass', 'copyHtml', 'imgProcess','svgSprite', 'styleguide'], 'watch', cb);
});

// Gulp prod task
gulp.task('prod', ['clean'], function(cb) {
    cb = cb || function() {};
    isProd = true;
    return runSequence(['sass', 'imgProcess', 'svgSprite', 'copyHtml'], 'watch', cb);
});
