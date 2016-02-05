var fs = require('fs');
var http = require('http');
var path = require('path');
var url = require('url');

module Exclusive {
	export var HostName: string = "localhost:8080/data/";
	/**Local Path to all data for Exclusive. */
	export var DataPath: string = path.join(process.cwd(), 'build', 'data');
	/**Local Path for App */
	export var AppPath: string = path.join(process.cwd(), 'build');
	
	export class Program {
		private server: Server
		constructor() {
			this.registerKeyEvents();
			DataStore.Initiate();
			this.server = new Server(8080);
			this.server.start()
		}

		registerKeyEvents() {
			// CTRL+C
			process.on("SIGINT", () => {
				this.server.stop()
				process.exit()
			});
		}
	}
}
var program = new Exclusive.Program();
