
require('dotenv').config({ path: 'variables.env' });
const path = require('path');
const gulp = require('gulp');
const concat = require('gulp-concat'); // 合并文件
const uglify = require('gulp-uglify'); // js 压缩
const csso = require('gulp-csso'); // css压缩
const imagemin = require('gulp-imagemin'); // 图片压缩
const clean = require('gulp-clean'); // 清空文件夹
const watch = require('gulp-watch'); // 监听静态文件
const runSequence = require('run-sequence'); // 同步执行任务
const gulpif = require('gulp-if'); // 区分开发 / 生产环境 执行压缩
const htmltpl = require('gulp-html-tpl'); // html模板
const artTemplate = require('art-template'); // html模板语法
const pump = require('pump'); // check js 时使用

const changed = require('gulp-changed');
const rename = require('gulp-rename'); // 重命名文件
const sourcemaps = require('gulp-sourcemaps');
const mapFile = path.join(__dirname, 'bundle.js.map');

const nodemon = require('gulp-nodemon'); // 监听文件并重启服务器
const babel = require('gulp-babel'); // ES6 > ES5 转码
const source = require('vinyl-source-stream'); // 流的暂存
const glob = require('glob'); // blob 二进制块
const exorcist = require('exorcist'); // 生成 source map 文件
const es = require('event-stream'); // browserify 时 merge task
const browserify = require('browserify'); // Node > bBrowser 转码
const browserSync = require('browser-sync'); // 监听文件并刷新浏览器

const browser = browserSync.create();
const rootPath = './src';
const destPath = './dist';
let env = 'dev';

const taskBabel = (taskName, src, dest) => {
    gulp.task(taskName, () => gulp.src(src).pipe(babel()).pipe(gulp.dest(dest)));
};
const taskBrowserify = (taskName, src, srcPath, dest) => {
    gulp.task(taskName, done => {
        glob(src, (err, files) => {
            if(err) return done(err);
            const tasks = files.map(entry => browserify({ entries: entry, debug: true })
                    .bundle()
                    // .pipe(exorcist(path.join(__dirname, entry+'.map')))
                    .pipe(source(entry.replace(srcPath, './')))
                    .pipe(gulp.dest(dest)));
            es.merge(tasks).on('end', done);
        });
    });
};
const taskUglify = (taskName, src, dest) => {
    gulp.task(taskName, () => gulp.src(src).pipe(gulpif(env === 'build', uglify())).pipe(gulp.dest(dest)));
};
const taskClean = (taskName, src) => {
    gulp.task(taskName, () => gulp.src(src).pipe(clean()));
};
const taskCheck = (taskName, src) => {
    gulp.task(taskName, (cb) => {
        pump([gulp.src(src), babel(), uglify()], cb);
    });
};
const taskCopy = (taskName, src, dest) =>  {
    gulp.task(taskName, () => gulp.src(src).pipe(gulp.dest(dest)));
}
if('seq') {
    // ['clean'],
    gulp.task('clean', () => gulp.src([`${destPath}/*`]).pipe(clean()));

    // ['html'],
    taskCopy('html', `${rootPath}/*.htm*`, destPath);
    taskCopy('assets', `${rootPath}/assets/*`, `${destPath}/assets`);
    taskCopy('public', `./public/*`, `${destPath}/`);

    // ['js', 'js-libs'],
    taskCheck('js-check', `${rootPath}/js/*.js`);
    taskBabel('jss-ba', `${rootPath}/js/*.js`, `${rootPath}/js/babel`);
    taskBrowserify('jss-bro', `${rootPath}/js/babel/*.js`, `${rootPath}/js/babel`, `${rootPath}/js/browserify`);
    taskUglify('jss-ug', `${rootPath}/js/browserify/*.js`, `${destPath}/js`);
    taskClean('clean-babel-browserify', [`${rootPath}/js/babel`, `${rootPath}/js/browserify`]);
    gulp.task('js', ['clean-babel-browserify'], () => runSequence(['js-check'], ['jss-ba'], ['jss-bro'], ['jss-ug']));

    taskCopy('js-libs', `${rootPath}/js/libs/*.js`, `${destPath}/js`);

    // ['css-libs', 'css'],
    taskCopy('css-libs', `${rootPath}/css/libs/*.css`, `${destPath}/css`);
    gulp.task('css', () => gulp.src(`${rootPath}/css/*.css`)
        .pipe(gulpif(env === 'build', csso()))
        .pipe(gulp.dest(`${destPath}/css`)));

    // ['server'],
    gulp.task('server', () => nodemon({
        script: 'server.js',
        ignore: ['gulpfile.js', 'package*.json', 'src/**/*.*', 'node_modules/', 'public/**/*.*', 'www/**/*.*', 'dist/**/*.*'],
    }));

    // ['browser'],
    gulp.task('browser', () => browser.init({
            proxy: `localhost:${process.env.PORT}`,
    }, () => console.log('Browser refreshed.')));
    gulp.task('browser-reload', () => browser.reload());

    // ['watch'],
    const doWatch = (watchPath, task) => watch(watchPath, () => runSequence(task, 'browser-reload'));
    gulp.task('watch', () => {
        doWatch(`${rootPath}/*.htm*`, 'html');
        doWatch(`${rootPath}/assets/*`, 'assets');
        doWatch(`./public/*`, 'public');

        doWatch(`${rootPath}/js/*.js`, 'js');
        doWatch(`${rootPath}/js/libs/*.js`, 'js-libs');

        doWatch(`${rootPath}/css/libs/*.css`, 'css-libs');
        doWatch(`${rootPath}/css/*.css`, 'css');

    });
}

const seq = (cb) => {
    runSequence(
        ['clean'],
        ['html', 'assets', 'public'],
        ['js-libs', 'js'],
        ['css-libs', 'css'],
        ['server'],
        ['browser'],
        ['watch'],
        cb
    );
};
gulp.task('dev', (cb) => { env = 'dev'; seq(cb); });
gulp.task('build', (cb) => { env = 'build'; seq(cb); });
gulp.task('run-build', () => { gulp.start(['build']); });
gulp.task('default', () => { gulp.start(['dev']); });