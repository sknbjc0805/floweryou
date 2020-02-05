// 各種プラグインの読み込み

var gulp         = require('gulp');
var sass         = require('gulp-sass');                // Sassコンパイル
var plumber      = require('gulp-plumber');             // エラー時の強制終了を防止
var notify       = require('gulp-notify');              // エラー発生時にデスクトップ通知
var sassGlob     = require('gulp-sass-glob');           // @importの記述を簡潔化
var browserSync  = require('browser-sync');             // ブラウザ反映
var postcss      = require('gulp-postcss');             // postcssのautoprefixerプラグイン利用のため
var autoprefixer = require('autoprefixer');             // ベンダープレフィックス付与
var cssdeclsort  = require('css-declaration-sorter');   // css並べ替え
var mmq          = require('gulp-merge-media-queries'); // メディアクエリの順番を整頓
var imagemin     = require('gulp-imagemin');            // 画像圧縮
var pngquant     = require('imagemin-pngquant');        // png画像の圧縮最適化
var mozjpeg      = require('imagemin-mozjpeg');         // jpg画像の圧縮最適化
var rename       = require("gulp-rename");              //ファイル名変更
var cleanCSS     = require("gulp-clean-css");           //cssの圧縮
var uglify       = require("gulp-uglify");              //jsの圧縮

// 各種タスク

// scssのコンパイル
gulp.task('sass', function () {
  return gulp
    .src('src/scss/**/*.scss')
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))//エラーチェック
    .pipe(sassGlob())// importの読み込みを簡潔化
    .pipe(sass({
      outputStyle: 'expanded' // expanded, nested, campact, compressedから選択
    }))
    // ベンダープレフィックス付加
    .pipe(postcss([
      //バージョン設定はpackage.jsonを確認
      autoprefixer({
        cascade: false
      })
    ]))
    .pipe(postcss([cssdeclsort({ order: 'alphabetically' })]))// プロパティをソート(アルファベット順)
    // ]))
    .pipe(mmq())// メディアクエリを整理
    // 圧縮前の状態で一度出力
    .pipe(gulp.dest('src/css'))// コンパイル後の出力先
    .pipe(cleanCSS())// cssの圧縮
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(gulp.dest('dist/css'));// コンパイル後の出力先
});


// サーバーを立ち上げる
gulp.task('browser-sync', function (done) {
  browserSync.init({

    //ローカル開発
    server: {
      // baseDir: "./",
      index: "index.html"
    }
  });
  done();
});


// 保存時のリロード
gulp.task('bs-reload', function (done) {
  browserSync.reload();
  done();
});


// jsの圧縮&rename
gulp.task('js-minify', function (done) {
  gulp.src('src/js/**/*.js')
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('dist/js'));
  done();
});

// cssの圧縮&rename
gulp.task('css-minify', function (done) {
  gulp.src('src/css/**/*.css')
    .pipe(cleanCSS())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('dist/css'));
  done();
});


// 監視
gulp.task('watch', function (done) {
  gulp.watch('arrangement.html', gulp.task('bs-reload')); //index.htmlが更新されたらbs-reloadを実行
  gulp.watch('src/scss/**/*.scss', gulp.task('sass')); //sassが更新されたらgulp sassを実行
  gulp.watch('src/scss/**/*.scss', gulp.task('bs-reload')); //sassが更新されたらbs-reloadを実行
  gulp.watch('src/js/*.js', gulp.task('bs-reload')); //jsが更新されたらbs-reloadを実行
  done();
});

// default
gulp.task('default', gulp.series(gulp.parallel('browser-sync', 'watch')));

//圧縮率の定義
var imageminOption = [
  // imagemin-pngquantv7.0.0以降、optionの書き方変更
  // pngquant({ quality: [70 - 85], }),
  pngquant({ quality: [.7, .85], }),
  mozjpeg({ quality: 85 }),
  imagemin.gifsicle({
    interlaced: false,
    optimizationLevel: 1,
    colors: 256
  }),
  imagemin.jpegtran(),
  imagemin.optipng(),
  imagemin.svgo()
];

// 画像の圧縮
// $ gulp imageminでsrc/img/フォルダ内の画像を圧縮し/img/フォルダへ格納
gulp.task('imagemin', function () {
  return gulp
    .src('src/img/**/*.{png,jpg,gif,svg}')
    .pipe(imagemin(imageminOption))
    .pipe(gulp.dest('dist/img'));
});