import * as path from "path"
import * as webpack from "webpack"
import * as ExtractTextPlugin from "extract-text-webpack-plugin"
import * as HtmlWebpackPlugin from "html-webpack-plugin"

const development = process.env.NODE_ENV == "development"

const config: webpack.Configuration = {
	devServer: {
		port: 8080,
		publicPath: "",
		contentBase: "./build/client/",
		stats: {
			colors: true,
		},
	},
	context: __dirname,
	entry: ["../source/client/App.ts"].concat(development ? [
			"webpack-hot-middleware/client",
		] : [
		]),
	devtool: "#source-map",
	resolve: {
		extensions: ["*", ".webpack.js", ".web.js", ".ts", ".js"],
	},
	externals: {
	},
	plugins: (development ? [
		new webpack.optimize.OccurrenceOrderPlugin(false),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
	] : [
		new webpack.optimize.UglifyJsPlugin(),
		new ExtractTextPlugin("style-[contenthash:10].css"),
	]).concat([
		new HtmlWebpackPlugin({ template: "../source/client/index.html" }),
		new webpack.DefinePlugin({development: JSON.stringify(development)}),
	]),
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader?configFileName=./tsconfig.json",
				exclude: /node_modules/,
			},
			{
				test: /\.json$/,
				use: "json-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				use: development ?
					[ "style-loader", "css-loader?localIdentName=[path][name]---[local]" ] :
					ExtractTextPlugin.extract({ loader: "css-leader?minimize&localIdentName=[hash:base64:10]" }) ,
				exclude: /node_modules/,
			},
		],
	},
	output: {
		path: path.resolve(__dirname, "../build/client/"),
		publicPath: "",
		filename: development ? "client.js" : "client.[hash:12].min.js",
	},
}
export default config
