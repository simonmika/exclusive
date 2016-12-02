import * as path from "path"
import * as webpack from "webpack"
import * as ExtractTextPlugin from "extract-text-webpack-plugin"
import * as HtmlWebpackPlugin from "html-webpack-plugin"

const development = process.env.NODE_ENV == "development"

const config: webpack.Configuration = {
	devServer: {
		contentBase: "../build",
		stats: {
			colors: true
		}
	},
	context: __dirname,
	entry: ["../source/client/App.ts"].concat(development ? [
			"webpack/hot/dev-server",
			"webpack-dev-server/client?http://localhost:8080"
		] : [
		]),
	devtool: "#source-map",
	resolve: {
		extensions: ["*", ".webpack.js", ".web.js", ".ts", ".js"],
	},
	externals: {
		jquery: 'jQuery'
	},
	plugins: (development ? [
		new webpack.HotModuleReplacementPlugin(),
	] : [
		new webpack.optimize.UglifyJsPlugin(),
		new ExtractTextPlugin("style-[contenthash:10].css"),
	]).concat([
		new HtmlWebpackPlugin({ template: "../source/client/index.html" }),
	]),
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader?configFileName=../source/client/tsconfig.json",
				exclude: /node_modules/
			},
			{
				test: /\.(u10)|(json)$/,
				use: "json-loader",
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use: development ?
					[ "style-loader", "css-loader?localIdentName=[path][name]---[local]" ] :
					ExtractTextPlugin.extract({ loader: "css-leader?minimize&localIdentName=[hash:base64:10]" }) ,
				exclude: /node_modules/
			},
		],
	},
	output: {
		path: path.resolve(__dirname, "../build/app"),
		publicPath: "/",
		filename: development ? "exclusive.client.js" : "exclusive.client.[hash:12].min.js",
	},
}
export default config
