/// <reference path="../../typings/node/node.d.ts" />
var fs = require('fs');
var http = require('http');
var path = require('path');
var url = require('url');

module Exclusive {
	export var HostName: string = "localhost:8080/data/";
	export var DataPath: string = path.join(process.cwd(), 'build', 'data');
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
