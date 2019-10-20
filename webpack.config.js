const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const buildDir = path.resolve(__dirname, './build');

let config = {
    node: {
        fs: 'empty'
    },
    output: {
        filename: 'bundle.js',
        path: buildDir,
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /(\.css|.scss)$/,
                use: ['style-loader', 'css-loader', { loader: 'sass-loader', options: { includePaths: ['node_modules'] } }]
            },
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: './index.html',
        }),
    ]
};

if (process.env.NODE_ENV === 'development') {
    const webpackHotMiddleware = 'webpack-hot-middleware/client?path=//localhost:3000/__webpack_hmr&reload=true';
    config = {
        ...config,
        mode: 'development',
        devServer: {
            hot: true
        },
        entry: {
            main: ['./src/index.js', webpackHotMiddleware]
        },
        plugins: [
            ...config.plugins,
            new webpack.HotModuleReplacementPlugin()
        ]
    }
} else {
    config = {
        ...config,
        entry: {
            main: ['babel-polyfill', './src/index.js']
        },
        mode: 'production',
    }
}

module.exports = config;