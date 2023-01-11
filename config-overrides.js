const webpack = require("webpack")
const path = require("path")
const NpmDtsPlugin = require("npm-dts-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const WebpackManifestPlugin =
	require("webpack-manifest-plugin").WebpackManifestPlugin

module.exports = function override(config, env) {
	const fallback = {
		...(config.resolve.fallback ? config.resolve.fallback : {}),
		crypto: false,
	}

	const outDir = "./build"
	config.target = "web"
	config.entry = {
		"KycDaoClient": "./src/KycDaoClient.ts",
		"KycDaoIframeClient": "./src/KycDaoIframeClient.ts",
		"index": "./src/index.js",
		"widget": "./src/widget.tsx",
	}
	config.output = {
		filename: "[name].js",
		library: "kycDaoWebSdk",
	}

	config.output.path = path.resolve(outDir)
	config.resolve.fallback = fallback
	config.resolve.modules = ["node_modules"]

	config.resolve.alias = {
		"@Pages": path.resolve(__dirname, "src/pages/"),
		"@Components": path.resolve(__dirname, "src/components/"),
		"@App": path.resolve(__dirname, "src/app/"),
		"@Utils": path.resolve(__dirname, "src/utils/"),
		"@Style": path.resolve(__dirname, "src/style/"),
		"@Hooks": path.resolve(__dirname, "src/hooks/"),
	}

	config.plugins = (config.plugins || []).concat([
		new webpack.ProvidePlugin({
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
			config.plugins.push(new NpmDtsPlugin({
				tsc: "--declarationDir build"
			}))
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

	config.plugins.push(
		new HtmlWebpackPlugin(
			Object.assign(
				{},
				{
					inject: true,
					template: "public/iframe.html",
				},
				env === "production"
					? {
							minify: {
								removeComments: true,
								collapseWhitespace: true,
								removeRedundantAttributes: true,
								useShortDoctype: true,
								removeEmptyAttributes: true,
								removeStyleLinkTypeAttributes: true,
								keepClosingSlash: true,
								minifyJS: true,
								minifyCSS: true,
								minifyURLs: true,
							},
					  }
					: undefined,
				{ filename: "iframe.html" }
			)
		)
	)

	config.devtool = "source-map"

	return config
}
