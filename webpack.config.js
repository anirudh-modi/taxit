module.exports = {
    entry: {
        admin: './client/index.js',
        customer: './client/customer.js',
        driver: './client/driver.js'
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