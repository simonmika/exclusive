import { Connection } from "./Connection"
import { Service } from "./Service"
import { HttpPath } from "./HttpPath"
import injectStaticServer from "./StaticServer"
import * as http from 'http';
import * as url from 'url';
import * as express from 'express'

export class Server {
	private server: http.Server
	private application: express.Application;
	constructor(private port: number) {
		this.application = express()
		this.application.all(/\/data.*/, this.requestCallback)
		injectStaticServer(this.application)
	}
	start() {
		this.server = this.application.listen(this.port, () => {
			console.log("Exclusive Server Started on port " + this.port);
		});
	}
	stop() {
		this.server.close(() => {
			console.log("Exclusive server Stoped");
		});
	}
	createRequest(url: string, request: string) {
		// TODO: create POST
	}
	private requestCallback(request: http.IncomingMessage, response: http.ServerResponse) {
			var parsedUrl = url.parse(request.url);
			var urlPath = HttpPath.Build(parsedUrl.path);
			var connection = new Connection(parsedUrl, request, response);
			var service = new Service();
		try {
			if (urlPath && urlPath.Head == "data")
				service.Process(connection, urlPath.Tail);
			else
				connection.Write("Page Requested Not Found", 404, { 'Content-Type': 'text/html' });
		} catch (error) {
			console.log("There was an error when processing a request.\n" + error.toString());
			connection.Write("Server error when processing request", 500, { 'Content-Type': 'text/html' });
		}
	}
}
