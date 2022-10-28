const webpack = require('webpack');
const path = require('path')
const NpmDtsPlugin = require('npm-dts-webpack-plugin')

module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};

    const outFile = path.basename(process.env.npm_package_main);
    const outDir = "./build"
    config.target = 'web'
    config.entry = ["./src/index.tsx", "./src/KycDaoClient.js"]
    config.output.filename = outFile
    config.output.path = path.resolve(outDir)
    config.resolve.fallback = fallback
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
            ethereum: ['ethereum', 'ethereum']
        }),
        new NpmDtsPlugin()
    ])

    return config;
}
