/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="ServerConfiguration.ts" />
var fs = require('fs');
var http = require('http');
var path = require('path');
var url = require('url');
module Exclusive {
	export class Program {
		private server: Server
		constructor() {
			var configFile = __dirname + "/../config.json";
			if (process.argv[2])
				configFile = process.argv[2];
			this.registerKeyEvents();
			ServerConfiguration.ReadServerConfigurations(configFile);
			DataStore.Initiate();
			this.server = new Server(ServerConfiguration.Port);
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
