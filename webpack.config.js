module.exports = {
    entry: {
        admin: './src/index.js',
        customer: './src/customer.js',
        driver: './src/driver.js'
    },
    output: {
        path: __dirname + '/public/bundles',
        filename: '[name]-bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    }
}