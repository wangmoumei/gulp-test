
//导入工具包 require('node_modules里对应模块')
var gulp = require('gulp'), //本地安装gulp所用到的地方
    less = require('gulp-less'), //less编译
    htmlmin = require('gulp-htmlmin'), //html压缩
    concat = require('gulp-concat'), //js合并
    uglify= require('gulp-uglify'), //js压缩
    rev = require('gulp-rev-append'),    //给页面的引用添加版本号
    cssmin = require('gulp-clean-css'),   //css压缩
    sourcemaps = require('gulp-sourcemaps'),    //source maps
    notify = require('gulp-notify'),  //错误通知
    plumber = require('gulp-plumber'),
    livereload = require('gulp-livereload'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;
 
//定义一个testLess任务（自定义任务名称）
gulp.task('testLess', function () {
    gulp.src('src/less/*.less') //该任务针对的文件
        .pipe(sourcemaps.init())
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(less()) //该任务调用的模块
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('src/css')) //将会在src/css下生成.css
        .pipe(concat('render.css'))//合并后的文件名
        .pipe(gulp.dest('dist/css'))
        .pipe(autoprefixer({browsers: ['> 1%']}))
        .pipe(gulp.dest('dist/css'))
        .pipe(cssmin()) //css压缩
        .pipe(gulp.dest('dist/css'));
});
 gulp.task('testHtmlmin', function () {
     var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('src/html/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/html'));
});
gulp.task('testConcat', function () {
    gulp.src('src/js/*.js')
        .pipe(concat('all.js'))//合并后的文件名
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('testWatch', function () {
    browserSync.init({
        server: "./src"
    });
    gulp.watch('src/less/*.less', ['testLess']); //当所有less文件发生改变时，调用testLess任务
    gulp.watch("src/*.html").on('change', reload);
});

gulp.task('default',['testLess', 'testHtmlmin', 'testConcat', 'testWatch']); //定义默认任务 elseTask为其他任务，该示例没有定义elseTask任务
 
//gulp.task(name[, deps], fn) 定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数
//gulp.src(globs[, options]) 执行任务处理的文件  globs：处理的文件路径(字符串或者字符串数组) 
//gulp.dest(path[, options]) 处理完后文件生成路径

gulp.task('less', function() {
    gulp.src('src/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('src/css'))
        .pipe(livereload());
});
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('src/less/**/*.less', ['less']);
});