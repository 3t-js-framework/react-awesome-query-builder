var webpack = require('webpack');
var path = require('path');

var webpack_config = require('./webpack.config');

webpack_config.plugins = [
    new webpack.NormalModuleReplacementPlugin(
        /^query-builder-lib/, function (data) {
            const suffix = data.request.substring('query-builder-lib'.length);
            data.request = path.resolve(__dirname, '../modules/' + suffix);
        }
    ),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    }),
    new webpack.optimize.UglifyJsPlugin({
        output: {
            comments: false
        },
        compressor: {
            screw_ie8: true,
            warnings: false
        }
    })
]

module.exports = webpack_config;
