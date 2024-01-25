const path = require('path')
const webpack = require("webpack")
const htmlWebpackPlugin = require("html-webpack-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

module.exports = {
    mode: "development",
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devServer: {
        open: true,
        hot: true,
        port: 3000,
        compress: true,
        static: {
            directory: path.join(__dirname, 'src'),
        },
    },
    plugins: [
        new htmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html',
            favicon: path.resolve('./src/favicon.ico')
        }),
        new CleanWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.css$/, use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(htm|html)$/,
                loader: 'html-withimg-loader'
            },
            {
                test: /\.(png|jpg|gif|jpeg|ico)$/,
                type: "asset/resource",
                generator: {
                    filename: "images/[name]_[hash:8][ext]"
                }
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
                exclude: /node_modules/
            },
        ]
    },
    resolve: {
        fallback: {
            crypto: false,
            http: false,
            https: false,
            os: false,
            stream: false,
            fs: false,
            url: false,
            buffer: false,
            process: false,
        }
    },
}