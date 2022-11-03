const webpack = require('webpack');
const path = require('path')
const NpmDtsPlugin = require('npm-dts-webpack-plugin');
const { argv } = require('process');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')

module.exports = function override(config, env) {
    const fallback = config.resolve.fallback
        ? { ...config.resolve.fallback, crypto: require.resolve("crypto-browserify") }
        : { crypto: require.resolve("crypto-browserify") }

    const outDir = "./build"
    config.target = 'web'
    config.entry = ["./src/KycDaoClient.ts", "./src/index.tsx"]
    config.output = {
        filename: "index.js",
        // publicPath: './dist/',
        library: { name: "@kycdao/kycdao-web-sdk", type: "umd" }
    }

    config.output.path = path.resolve(outDir)
    config.resolve.fallback = fallback

    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
            ethereum: ['ethereum', 'ethereum'],
//            crypto: ['crypto', 'crypto-browserify']
        })
    ])

    config.module.rules.unshift({
        test: /\.(woff(2)?|ttf)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputPath: 'fonts/'
            }
        }]
    })

    if (env === 'production') {
	console.log('PROD')
//        config.plugins.push(new NpmDtsPlugin())
    }

    //missing sourcemaps 
    config.ignoreWarnings = [/Failed to parse source map/]

    config.plugins.splice(config.plugins.findIndex(plugin => plugin instanceof MiniCssExtractPlugin), 1)

    // config.plugins.splice(config.plugins.findIndex(plugin => plugin instanceof WebpackManifestPlugin), 1)

    config.plugins.push(new MiniCssExtractPlugin({
        filename: 'static/css/[name].css',
        chunkFilename: 'static/css/[name].chunk.css',
    }))

    return config;
}
