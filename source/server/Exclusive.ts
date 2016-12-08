import { ServerConfiguration } from "./ServerConfiguration"
import { DataStore } from "./DataStore"
import { Server } from "./Server"

export class Program {
	private server: Server
	constructor() {
		var configFile = __dirname + "/../config.json";
		if (process.argv[2])
			configFile = process.argv[2];
		this.registerKeyEvents();
		ServerConfiguration.ReadServerConfigurations(configFile);
		DataStore.Initiate();
		this.server = new Server(ServerConfiguration.ListenPort);
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
var program = new Program();
