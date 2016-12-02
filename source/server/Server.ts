import { Connection } from "./Connection"
import { Service } from "./Service"
import { HttpPath } from "./HttpPath"

import * as http from 'http';
import * as url from 'url';

export class Server {
	private server: any;
	constructor(private port: number) {
		this.server = http.createServer((request: any, response: any) => {
			this.requestCallback(request, response);
		});
	}
	start() {
		this.server.listen(this.port, () => {
			console.log("listening on port " + this.port);
		});
	}
	stop() {
		this.server.close(() => {
			console.log("Exclusive server closed");
		});
	}
	createRequest(url: string, request: string) {
		// TODO: create POST
	}
	private requestCallback(request: any, response: any) {
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
