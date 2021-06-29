const path = require('path');

module.exports = {
    entry: './src/index.cjs',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'piesocket.js',
        library: 'PieSocket'
    }
};