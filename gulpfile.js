var gulp = require('gulp');
//編譯SASS
var sass = require('gulp-sass');
//自動判斷前措詞
var autoprefixer = require('gulp-autoprefixer');

var postcss = require('gulp-postcss');
//編譯出錯時不停止gulp
var plumber = require('gulp-plumber');
//編譯ES6
var babel = require('gulp-babel');
//把JS檔合併成一個
var concat = require('gulp-concat');
//把css合併
var concatCss = require('gulp-concat-css');
//將壓縮的js檔在未壓縮的位置標記出來
var sourcemaps = require('gulp-sourcemaps');
//載入順序
var order = require('gulp-order');
//建立伺服器
var browserSync = require('browser-sync').create();
//壓縮css
var cleanCSS = require('gulp-clean-css');
//壓縮js
var uglify = require('gulp-uglify');
//將public後的版本，上傳到github上並建立pages
var ghPages = require('gulp-gh-pages');

//刪除資料夾
var clean = require('gulp-clean');

//依序執行gulp方法
var gulpSequence = require('gulp-sequence');

//圖片壓縮
var imagemin = require('gulp-imagemin');

//判斷envOptions環境而選擇要執行甚麼 
var gulpif = require('gulp-if');

const { urlLoader } = require('gulp-url-loader')

/* 
        在cmd中改變env值方法為 
        gulp 執行的方法名字 --env 改變的內容
    ex: gulp tranSass --env public   
*/

//設定gulp環境(ex:開發環境時，不壓縮檔案---發佈時，壓縮檔案)
var minimist = require('minimist');
var envOptions = {
    string:'env',
    default:{ env: 'develop' }
}

var options = minimist(process.argv.slice(2),envOptions);
console.log(options);

gulp.task('clean', function(){
    return gulp.src(['./.tmp','./dist','./.publish'],{read:false}).pipe(clean());
});

gulp.task('copyhtml',function(){
    return gulp.src('./src/**/*.html').pipe(gulp.dest('./dist/'));
});

gulp.task('tranScss',function(){
    return gulp.src(['./src/scss/**/*.scss'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error',sass.logError))
    //編成CSS
    .pipe(autoprefixer({
        browsers:['last 2 version']
    }))
    .pipe(gulpif(options.env === 'public',cleanCSS()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css'))
})
gulp.task('contactCSS', function () {
    return gulp.src(['./node_modules/bootstrap/dist/css/bootstrap.min.css',/* './node_modules/animate.css/animate.min.css',
    './node_modules/font-awesome/css/font-awesome.min.css' */])
      .pipe(order([
          'bootstrap.min.css',
          'animate.min.css',
          'font-awesome.min.css'
      ]))
      .pipe(concatCss("vendors.css"))
      .pipe(cleanCSS())
      .pipe(gulp.dest('./dist/css'));
  });

gulp.task('copyFont',function(){
    return gulp.src('./node_modules/font-awesome/font/**/*')
    .pipe(gulp.dest('./dist/images/'))
})

gulp.task('babel',function(){
    return gulp.src('./src/js/**/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets:['env']
    }))
    .pipe(concat('all.js'))
    .pipe(gulpif(options.env === 'public',uglify({
        compress:{
            drop_console: true
        }
    })))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/js'))
})

gulp.task('vendorJs',function(){
    return gulp.src(['./node_modules/jquery/dist/jquery.min.js'])
    .pipe(concat('vendors.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
})

gulp.task('browser-sync',function(){
    browserSync.init({
        server:{
            baseDir:'./dist'
        }
    })
})

gulp.task('imagemin',function(){
    return gulp.src('src/images/*')
    .pipe(gulpif(options.env === 'public',imagemin()))
    .pipe(gulp.dest('dist/images'))
})

gulp.task('public',function(){
    return gulp.src(['/dist/**/*'])
    .pipe(ghPages());
})

gulp.task('watch',function(){
    gulp.watch('./src/scss/**/*.scss',['tranScss'])
    gulp.watch('./src/js/**/*.js',['babel'])
    gulp.watch('./src/**/*.html',['copyhtml'])
    gulp.watch('.src/images/*',['imagesmin'])
})

gulp.task('build',gulpSequence('clean','copyhtml','tranScss','babel','vendorJs','imagesmin'))

gulp.task('default',['copyhtml','tranScss','contactCSS','babel','vendorJs','imagemin','watch'])