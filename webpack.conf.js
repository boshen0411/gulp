import webpack from 'webpack'

export default class WebapckConfig {

    init(runServer, runCompression, runDest, indexJSPath, destPath) {

        let plugins = []
        let entry = [indexJSPath]
        let env = {}


        // plugins
        // js代码压缩
        if(runDest) {
            plugins.push(
                // 代码压缩
                new webpack.optimize.UglifyJsPlugin({
                    comments: false,    // 保留注释
                    compressor: {       //压缩器设置
                        screw_ie8: true,    // 忽略IE8
                        warnings: false,  // 显示警告
                    },
                })
            )
        }

        return {
            // 入口文件
            entry: entry,
            // 输出
            output: {
                // 生成的JS集合文件路径
                path: destPath,
                // 生成的JS集合文件名
                filename: 'bundle.js',
            },
            // loader
            module: {
                loaders: [
                    {
                        test: require.resolve('jquery'),
                        loader: 'expose?jQuery!expose?$'
                    },
                {
                    // 后缀正则
                    test: /\.js$/,
                    // 加载器组
                    loaders: ['babel'],
                    // 忽略正则
                    exclude: /node_modules/,
                    // 包含
                    // include: __dirname
                }, {
                    test: /\.json$/,
                    loaders: ['json'],
                    exclude: /node_modules/,
                    // include: [contentPath, __dirname]
                }, {
                    test: /\.less$/,
                    loaders: ['style', 'css', 'less'],
                    // include: __dirname
                }, {
                    test: /\.css$/,
                    loaders: ['style', 'css'],
                    exclude: /node_modules/,
                    // include: __dirname
                }, {
                    test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                    loaders: ['url?limit=1024&mimetype=application/font-woff'],
                    // include: __dirname
                }, {
                    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                    loaders: ['url?limit=1024&mimetype=application/octet-stream'],
                    // include: __dirname
                }, {
                    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                    loaders: ['file'],
                    // include: __dirname
                }, {
                    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                    loaders: ['url?limit=1024&mimetype=image/svg+xml'],
                    // include: __dirname
                }, {
                    test: /\.(png|jpg)$/,
                    loaders: ['url?limit=1024'], // 单位bit
                    exclude: /node_modules/,
                    // include: __dirname
                }],
            },
            // plugins
            plugins: [
                // 模块ID发生器,按引用频度来排序ID,使得模块ID可预见,以便达到减少文件大小和引用
                new webpack.optimize.OccurrenceOrderPlugin (),

                // // 定义全局变量
                new webpack.DefinePlugin(env),

                // // 重复数据删除
                new webpack.optimize.DedupePlugin(),
                ...plugins

            ],
        }
    }
}
