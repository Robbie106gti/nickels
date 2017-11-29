const path = require('path');

module.export = {
    entry: {        
        app: [
            './src/main.js',
            'babel-polyfill'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['env', 'stage-0']
            }
        }]
    }

}