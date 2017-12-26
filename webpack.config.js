const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const isDev = process.env.NODE_ENV === "development";

const extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: isDev
});

const indexHtml = path.resolve(__dirname, 'src/index.js');
const BUILD_DIR = 'docs';

const getPlugins = () => isDev ? [
    new HtmlWebpackPlugin({
        template: './src/index.html'
    }),
    extractSass
] : [
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({
        template: './src/index.html'
    }),
    extractSass
];

const config = {
    entry: [
        indexHtml
    ],
    output: {
        path: path.resolve(__dirname, BUILD_DIR),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            }
        ]
    },
    plugins: getPlugins(),
    devtool: 'inline-source-map'
};

module.exports = config;