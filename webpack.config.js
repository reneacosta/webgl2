module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/build',
    },
    watchOptions: {
        ignored: /node_modules/
    },
    externals: {
        'fs': true,
        'path': true,
    },
}