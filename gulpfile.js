// plugins
import gulp from 'gulp'

// node 文件系统

// 命令行文本颜色控制
import 'colors'

// 参数
import minimist from 'minimist'

// 文件删除
import del from 'del'

// 工程配置信息
import Conf from './site.conf.js'

// webpack
import gulp_webpack from 'gulp-webpack'
import WebapckConfig from './webpack.conf.js'

// 文件内容替换
import replace from 'gulp-str-replace'


// 文件重命名
import rename from 'gulp-rename'

import print from 'gulp-print'
import gutil from 'gulp-util'

// 监听
import gulpWatch from 'gulp-watch'
import gulpBatch from 'gulp-batch'

// less
import gulpLess from 'gulp-less'
// CSS 后处理框架
import postcss from 'gulp-postcss'
// css 前缀处理 - postcss插件
import autoprefixer from 'autoprefixer'
// css 压缩 - postcss插件
import cssnano from 'cssnano'
// css ie兼容性处理
import cssgrace from 'cssgrace'

// css压缩
import minifycss from 'gulp-minify-css'
// js压缩
import minifyjs from 'gulp-uglify'

import babel from 'gulp-babel'

// html模板扩展
import htmlTagInclude from 'gulp-html-tag-include'

import connect from 'gulp-connect'

// 构建参数
let {
    PC: runPC, // 工程类型: PC
    dest: runDest, // 正式环境
    server: runServer, // 运行服务器
    compression: runCompression, // 使用压缩
} = minimist(process.argv.slice(2)) // 获取命令行参数
// webpack conf
let webapckConfig

// 工程配置
var conf = new Conf(runPC ? 'pc' : 'mob')
// 任务注册
gulp.task(clean)
gulp.task(buildContent)
gulp.task(buildHTML)
gulp.task(buildLib)
gulp.task(buildJS)
gulp.task(buildLESS)
gulp.task(empty)
gulp.task(server)
// gulp.task(buildMinifyJS)
gulp.task(watch)

// 任务序列
gulp.task('build', gulp.series(
    'clean',
    'buildLib',
    'buildContent',
    'buildHTML',
    'buildJS',
    'buildLESS',
    'watch',
    'server'
))

gulp.task('server', gulp.series(
    'server'
))

// gulp.task('buildMinifyJS',gulp.series(
//     'buildMinifyJS'
// ))

function watch() {

    gulpWatch(`${conf.path.libPath}/**`, gulpBatch(function (event, done) {
        buildLib(done)
    }))
    gulpWatch(`${conf.path.contentPath}/**`, gulpBatch(function (event, done) {
        buildContent(done, event)
    }))

    gulpWatch(`${conf.path.lessPath}/*.less`, gulpBatch(function (event, done) {
        buildLESS(done)
    }))


    gulpWatch(`${conf.path.jsPath}/*.js`, gulpBatch(function (event, done) {
        buildJS(done)
    }))

    gulpWatch(`${conf.path.componentPath}/*.html`, gulpBatch(function (event, done) {
        buildHTML(done)
    }))
    gulpWatch(`${conf.path.htmlPath}/*.html`, gulpBatch(function (event, done) {
        buildHTML(done)
    }))

    gulpWatch(`${conf.path.srcPath}/**`, gulpBatch(function (event, done) {
        server(done)
    }))


}

let date = new Date()
let time = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}-${date.getHours()}:${date.getMinutes()+1}:${date.getSeconds()}`

let replace_html
if (runDest) {
    replace_html = {
        original: {
            bundlejs: /<script src='\/js\/bundle\.js'><\/script>/g,
            bundlecss: /<link rel='stylesheet' href='\/css\/bundle\.css' \/>/g,
            images1719Path: /..\/..\/content/g,
            libPath: /\..\/lib/g,
            libjs: /\.js"><\/script>/g,
        },
        target: {
            bundlejs: `<script src='/js/bundle.js?time=${time}'></script>`,
            bundlecss: `<link rel='stylesheet' href='/css/bundle.css?time=${time}'/>`,
            images1719Path: ``,
            libPath: `/js`,
            libjs: `.js?time=${time}"></script>`,
        },
    }
} else {
    replace_html = {
        original: {
            images1719Path: /..\/..\/content/g,
            libPath: /\..\/lib/g,
        },
        target: {
            images1719Path: ``,
            libPath: `/js`,
        },
    }
}


function buildHTML(cb, event) {
    log('buildHTML')
    return gulp.src(`${conf.path.htmlPath}/**/*.html`)
        .pipe(htmlTagInclude())
        .pipe(replace(replace_html))
        .pipe(gulp.dest(conf.path.distPath))
        .pipe(print(function (filepath) {
            return '构建结束: ' + filepath
        }))
        .on('end', cb)
        .pipe(connect.reload())
}

function buildJS(cb) {
    log('buildJS')
    webapckConfig = webapckConfig ? webapckConfig : buildWebpackConfig()
    gulp.src(`${conf.path.jsPath}/index.js`)
        .pipe(gulp_webpack(webapckConfig))
        .pipe(replace({
            original: {
                images1719Path: /..\/..\/content/g,
            },
            target: {
                images1719Path: ``,
            },
        }))
        .pipe(gulp.dest(`${conf.path.distPath}/js`))
        .pipe(print(function (filepath) {
            return '构建结束: ' + filepath
        }))
        .on('end', cb)
        .pipe(connect.reload())
}

function buildLESS(done) {
    return _buildLESS(done, `${conf.path.lessPath}/index.less`, 'bundle.css')
}


function _buildLESS(cb, path, name) {
    log(name)

    let processor = [
        autoprefixer({
            browsers: ['last 2 version']
        }),
        cssgrace,
    ]

    if (runDest) {
        processor = [
            cssnano(),
            ...processor
        ]
    }

    return gulp.src(path)
        .pipe(gulpLess())
        .on('error', function (err) {
            gutil.log('Less Error!', err.message)
            cb && cb()
            this.end(cb)
        })
        .pipe(postcss(processor))
        .pipe(rename(name))
        .pipe(replace({
            original: {
                bootstrapFontPath: /url\('..\/fonts/g,
                bootstrapFontPathCompression: /url\(..\/fonts/g,
                images1719Path: /url\(..\/..\/content/g,
            },
            target: {
                bootstrapFontPath: `url('./font`,
                bootstrapFontPathCompression: `url(./font`,
                images1719Path: `url(${conf.path.images1719ComDomainPath}`,
            },
        }))
        .pipe(connect.reload())
        .pipe(gulp.dest(`${conf.path.distPath}/css`))
        .pipe(print(function (filepath) {
            return '构建结束: ' + filepath
        }))
        .on('end', cb)
}

function buildContent(cb, event) {
    log('buildContent')
    let devicePath = 'image'
    if (event) {
        event.pipe(gulp.dest(`${conf.path.images1719ComRealPath}`))
            .pipe(print(function (filepath) {
                return '构建结束: ' + filepath
            }))
            .on('end', cb)
    } else {
        return gulp.src(`${conf.path.contentPath}/${devicePath}/**`)
            .pipe(gulp.dest(`${conf.path.images1719ComRealPath}/${devicePath}`))
            .pipe(print(function (filepath) {
                return '构建结束: ' + filepath
            }))
            .pipe(connect.reload())
    }
}


function buildLib(cb) {
    log('buildLib')
    if(runDest){
        return gulp.src(`${conf.path.libPath}/**`)
        .pipe(babel())
        .pipe(minifyjs())
        .pipe(gulp.dest(`${conf.path.distPath}/js`))
        .pipe(print(function (filepath) {
            return '构建结束: ' + filepath
        }))
        .on('end', cb)
        .pipe(connect.reload())
    }else{
        return gulp.src(`${conf.path.libPath}/**`)
        .pipe(babel())
        .pipe(gulp.dest(`${conf.path.distPath}/js`))
        .pipe(print(function (filepath) {
            return '构建结束: ' + filepath
        }))
        .on('end', cb)
        .pipe(connect.reload())
    }
}


// 构建webpack配置参数
function buildWebpackConfig() {
    log('buildWebpackConfig')

    return new WebapckConfig().init(
        runServer,
        runCompression,
        runDest,
        `${conf.path.jsPath}/index.js`,
        conf.path.distPath
    )

}

// 空任务
function empty() {
    return gulp.src('./')
}

// 服务器
function server() {
    log('server')
    return connect.server({
        root: conf.path.distPath,
        livereload: true,
        port: 6005,
    })
}

// 清理文件
function clean() {
    log('clean')

    return del([
        `${conf.path.distPath}/*`,
        `${conf.path.projectPath}/npm-debug.log`,
    ], {
        force: false, // 删除工程外部权限
    })
}

// 日志
function log(title = '', mesg = '', type = 'head') {

    if (typeof mesg == 'object' && Object.prototype.toString.call(mesg).toLowerCase() == '[object object]' && !mesg.length) {
        mesg = JSON.stringify(mesg, null, '\t')
    }

    if (type == 'head') {
        console.log('\n' + '    '.bgGreen + title.bgWhite.green + '\n' + mesg.bgBlack + '\r')
    } else if (type == 'mesg') {
        console.log('\n' + title.bgWhite.green + ' :\n' + mesg + '\n')
    }
}