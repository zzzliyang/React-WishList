var path = require('path');

module.exports = {
    entry: {
        'skynet-pricer': './index.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        libraryTarget: 'var',
        library: 'SkyNetPricer',
        filename: '[name].js',
        path: '../../skynet-web/src/main/webapp/scripts/js'
    },
    devtool: 'inline-source-map',
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react', 'stage-2']
                }
            }
        ]
    },
    externals: {
        'Handsontable': 'Handsontable'
    },

    resolve: {
        alias: {
            'react': path.resolve('../node_modules/react'),
            'react-dom': path.resolve('../node_modules/react-dom'),
            'skynet-core': path.resolve('../skynet-core'),
            'skynet-ui': path.resolve('../skynet-ui')
        }
    }
};
