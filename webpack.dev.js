const path = require('path')
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env) => {
    let apiServer = JSON.stringify(env.API_SERVER)

    console.log('apiServer', apiServer)

    return {
        mode: 'development',
        entry: './src/main.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].bundle.js'
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
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, './src/index.html'),
                filename: 'index.html',
                favicon: path.resolve('./src/favicon.ico')
            }),
            new CleanWebpackPlugin(),
            new webpack.DefinePlugin({
                "process.env": {
                    MODE_ENV: JSON.stringify('development'),
                    API_SERVER: apiServer,
                }
            }),
            new MiniCssExtractPlugin({
                filename: '[name].bundle.css',
                chunkFilename: '[name].chunk.css'
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'],
                    exclude: /node_modules/,
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
        performance: {
            hints: false,
        },
    }
}