let path = require('path');
let webpack = require('webpack');
let ZipPlugin = require('zip-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'skill_bundle.js',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    externals: {
        "aws-sdk": "aws-sdk"
    },
    devtool: 'source-map',
    target: 'node',
    plugins: [
        new ZipPlugin({
            fileOptions: {
                mtime: new Date(),
                mode: 0o100664,
                compress: true,
                forceZip64Format: false,
            },
            pathPrefix: './',
        })
    ],
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            },
            {
                test: /\.js$/,
                loader: 'source-map-loader',
            }
        ]
    }
};