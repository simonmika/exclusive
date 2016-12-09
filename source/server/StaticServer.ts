import * as express from "express"
import * as path from "path"
import * as webpack from "webpack"
import * as ExtractTextPlugin from "extract-text-webpack-plugin"
import * as HtmlWebpackPlugin from "html-webpack-plugin"
import WebpackConfiguration from "../webpack.config"
import * as WebpackDevServer from "webpack-dev-server"

const development = process.env.NODE_ENV == "development"
export default function inject(application: express.Application) {
	if (development) {
		console.log("Starting Webpack Dev Server.")
		const compiler = webpack(WebpackConfiguration)
		application.use(require("webpack-dev-middleware")(compiler, WebpackConfiguration.devServer))
		application.use(require("webpack-hot-middleware")(compiler))
	}
	else {
		application.use(/\/data\/app.*/, express.static("./data/client"))
	}
}
