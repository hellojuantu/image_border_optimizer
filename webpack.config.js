const path = require('path')

// 这里引入的webpack需要使用 npm install webpack -D 安装模块
const webpack = require("webpack")

const htmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    mode: "development",
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devServer: {
        open: true, // 启动后，在浏览器自动打开首页，为false则不自动打开。
        hot: true,  // 启用热更新，热重载
        port: 3000,     // 启动服务的端口号
        compress: true, // 开启服务gzip压缩
        // historyApiFallback: true,// 使用 History 路由模式时，若404错误，则被替代为 index.html
        static: { // 告诉服务器获取资源的目录
            directory: path.join(__dirname, 'src'),      // 添加src为资源获取目录，webpack5默认获取资源是public目录
            // publicPath: '/test',  // 设置内存中的打包文件的虚拟路径映射，设置后所有的uri都需要在之前拼接上 /test
        },
        // contentBase:path.resolve(__dirname,'asset')  //webpack5弃用，在static中被修改为 directory
        // publicPath:'/test',    // webpack5弃用,在static中定义
    },
    plugins: [
        new htmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html'
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser'
        }),
    ],
    module: {   // 这个节点，用于配置 所有 第三方模块 加载器
        rules: [    // 所有第三方模块的 匹配规则
            {test: /\.css$/, use: ['style-loader', 'css-loader']},    //  配置处理 .css 文件的第三方loader 规则, 需要安装 style-loader、css-loader
            // { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] }, //配置处理 .less 文件的第三方 loader 规则，需安装 less、less-loader
            // { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] }, // 配置处理 .scss 文件的 第三方 loader 规则，需安装 sass、node-sass、scss-loader
            // { test: /\.(jpg|png|gif|bmp|jpeg)$/, use: 'url-loader?limit=7631&name=[hash:8]-[name].[ext]' }, // 处理 图片路径的 loader
            // // limit 给定的值，是图片的大小，单位是 byte， 如果我们引用的 图片，大于或等于给定的 limit值，则不会被转为base64格式的字符串， 如果 图片小于给定的 limit 值，则会被转为 base64的字符串
            // { test: /\.(ttf|eot|svg|woff|woff2)$/, use: 'url-loader' }, // 处理 字体文件的 loader
            {
                test: /.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
                exclude: /node_modules/
            }, // 配置 Babel 来转换高级的ES语法
        ]
    },
    resolve: {
        fallback: {
            crypto: require.resolve("crypto-browserify"),
            http: require.resolve("stream-http"),
            https: require.resolve("https-browserify"),
            os: require.resolve("os-browserify/browser"),
            stream: require.resolve("stream-browserify"),
            fs: require.resolve("fs"),
            // url: false,
            // buffer: false,
            // process: false,
        }
    },
}