const webpack = require('webpack');
const path = require('path')
const NpmDtsPlugin = require('npm-dts-webpack-plugin');
const { argv } = require('process');

module.exports = function override(config, env) {
    const fallback = config.resolve.fallback
        ? { ...config.resolve.fallback, crypto: require.resolve("crypto-browserify") }
        : { crypto: require.resolve("crypto-browserify") }


    const outFile = path.basename('dist/index.js');
    

    const outDir = "./build"
    config.target = 'web'
    config.entry = ["./src/index.tsx", "./src/KycDaoClient.ts"]
    config.output.filename = outFile


    config.output.path = path.resolve(outDir)
    config.resolve.fallback = fallback


    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
            ethereum: ['ethereum', 'ethereum'],
            crypto: ['crypto', 'crypto-browserify']
        })
    ])



    if (env === 'production') {
        config.plugins.push(new NpmDtsPlugin())
    }

    return config;
}
