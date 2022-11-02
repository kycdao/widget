const webpack = require('webpack');
const path = require('path')
const NpmDtsPlugin = require('npm-dts-webpack-plugin');
const { argv } = require('process');

module.exports = function override(config, env) {
    const fallback = config.resolve.fallback
        ? { ...config.resolve.fallback, crypto: require.resolve("crypto-browserify") }
        : { crypto: require.resolve("crypto-browserify") }

    console.log('xxx', process.env.npm_package_main)

    const outFile = path.basename('dist/index.js');
    
    console.log('xxx000')

    const outDir = "./build"
    config.target = 'web'
    config.entry = ["./src/index.tsx", "./src/KycDaoClient.ts"]
    config.output.filename = outFile

    console.log('abc1')

    config.output.path = path.resolve(outDir)
    config.resolve.fallback = fallback

    console.log('abc')

    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
            ethereum: ['ethereum', 'ethereum'],
            crypto: ['crypto', 'crypto-browserify']
        })
    ])


    console.log('yyy')

    if (env === 'production') {
        config.plugins.push(new NpmDtsPlugin())
    }

    return config;
}
