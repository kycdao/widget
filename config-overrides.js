const webpack = require("webpack")
const path = require("path")
const NpmDtsPlugin = require("npm-dts-webpack-plugin")
const process = require("process")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const WebpackManifestPlugin =
	require("webpack-manifest-plugin").WebpackManifestPlugin

module.exports = function override(config, env) {
	const fallback = config.resolve.fallback
		? {
				...config.resolve.fallback,
				crypto: require.resolve("crypto-browserify"),
		  }
		: { crypto: require.resolve("crypto-browserify") }

	const outDir = "./build"
	config.target = "web"
	config.entry = {
		client: "./src/KycDaoClient.ts",
		iframeClient: "./src/KycDaoIframeClient.ts",
		app: "./src/index.js",
	}
	config.output = {
		filename: "[name].min.js",
		library: "kycDaoWebSdk",
	}

	config.output.path = path.resolve(outDir)
	config.resolve.fallback = fallback
	config.resolve.modules = ["node_modules"]
	// config.resolve.alias = {
	// 	...config.resolve.alias,
	// 	"@": path.resolve(__dirname, "src"),
	// }

	config.plugins = (config.plugins || []).concat([
		new webpack.ProvidePlugin({
			process: "process/browser",
			Buffer: ["buffer", "Buffer"],
			ethereum: ["ethereum", "ethereum"],
		}),
	])

	config.module.rules.unshift({
		test: /\.(woff2?)$/,
		dependency: { not: ["file"] },
		type: "asset/resource",
	})

	if (env === "production") {
		if (process.env.NODE_ENV !== "development") {
			config.plugins.push(new NpmDtsPlugin())
		}
	}

	//missing sourcemaps
	config.ignoreWarnings = [/Failed to parse source map/]

	config.plugins.splice(
		config.plugins.findIndex(
			(plugin) => plugin instanceof MiniCssExtractPlugin
		),
		1
	)

	config.plugins.splice(
		config.plugins.findIndex(
			(plugin) => plugin instanceof WebpackManifestPlugin
		),
		1
	)

	config.plugins.push(
		new MiniCssExtractPlugin({
			filename: "[name].css",
		})
	)

	config.devtool = "source-map"

	return config
}
