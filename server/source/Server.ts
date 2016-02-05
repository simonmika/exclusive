/// <reference path="../../typings/node/node.d.ts" />

module Exclusive {
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
			var urlPath = HttpPath.Build(parsedUrl.pathname);
			var connection = new Connection(parsedUrl.href, request, response);
			var service = new Service();
			if (urlPath && urlPath.Head == "data")
				service.Process(connection, urlPath.Tail);
			else
				connection.Write("Page Requested Not Found", 404, { 'Content-Type': 'text/html' });
		}
	}
}
