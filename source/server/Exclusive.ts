import { ServerConfiguration } from "./ServerConfiguration"
import { DataStore } from "./DataStore"
import { Server } from "./Server"

export class Program {
	private server: Server
	constructor() {
		const configFile = process.argv[2] ? process.argv[2] : __dirname + "/../config.json"
		this.registerKeyEvents()
		ServerConfiguration.ReadServerConfigurations(configFile)
		DataStore.Initiate()
		this.server = new Server(ServerConfiguration.ListenPort)
		this.server.start()
	}
	registerKeyEvents() {
		// CTRL+C
		process.on("SIGINT", () => {
			this.server.stop()
			process.exit()
		})
	}
}
const program = new Program()
