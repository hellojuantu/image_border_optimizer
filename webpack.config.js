const path = require('path')
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');

module.exports = (env) => {
    let modeEnv = JSON.stringify(env.MODE_ENV)
    let apiServer = JSON.stringify(env.API_SERVER)

    console.log('modeEnv', modeEnv)
    console.log('apiServer', apiServer)

    return {
        mode: 'production',
        entry: {
            shared: [
                'jszip',
                'file-saver',
                'sortablejs',
            ],
            main: {
                import: './src/main.js',
                dependOn: 'shared',
            },
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].bundle.js'
        },
        optimization: {
            minimize: true,
            minimizer: [
                new TerserJSPlugin({
                    extractComments: false
                }),
                new CssMinimizerPlugin({
                    minimizerOptions: {
                        parallel: true,
                        preset: [
                            "default",
                            {
                                discardComments: {removeAll: true},
                            },
                        ],
                    },
                }),
            ],
            splitChunks: {
                chunks: "all",
                minSize: 1024 * 300,
                maxSize: 1024 * 600,
                cacheGroups: {
                    styles: {
                        name: 'styles',
                        test: /\.css$/,
                        chunks: 'all',
                        enforce: true,
                    },
                }
            }
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
                    MODE_ENV: modeEnv,
                    API_SERVER: apiServer,
                }
            }),
            new MiniCssExtractPlugin({
                filename: '[name].bundle.css',
                chunkFilename: '[name].chunk.css'
            }),
            new CssMinimizerPlugin(),
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