import { Connection } from "./Connection"
import { Service } from "./Service"
import { HttpPath } from "./HttpPath"
import { Configuration } from "./Configuration"
import injectStaticServer from "./StaticServer"

import * as http from "http"
import * as url from "url"
import * as express from "express"

export class Server {
	private server: http.Server
	private application: express.Application
	constructor(private configuration: Configuration) {
		this.application = express()
		this.application.all(/\/data.*/, this.requestCallback.bind(this))
		injectStaticServer(this.application)
	}
	start() {
		this.server = this.application.listen(this.configuration.listenPort, () => {
			console.log("Exclusive Server Started on port " + this.configuration.listenPort)
		})
	}
	stop() {
		this.server.close(() => {
			console.log("Exclusive server Stoped")
		})
	}
	createRequest(url: string, request: string) {
		// TODO: create POST
	}
	private requestCallback(request: http.IncomingMessage, response: http.ServerResponse) {
		const parsedUrl = url.parse(request.url)
		const urlPath = HttpPath.Build(parsedUrl.path)
		const connection = new Connection(this.configuration, parsedUrl, request, response)
		const service = new Service(this.configuration)
		try {
			if (urlPath && urlPath.Head == "data")
				service.Process(connection, urlPath.Tail)
			else
				connection.Write("Page Requested Not Found", 404, { "Content-Type": "text/html" })
		} catch (error) {
			console.log("There was an error when processing a request.\n" + error.toString())
			connection.Write("Server error when processing request", 500, { "Content-Type": "text/html" })
		}
	}
}
