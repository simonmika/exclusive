import { Configuration } from "./Configuration"
import { DataStore } from "./DataStore"
import { Server } from "./Server"
import settings from "../exclusive.config"

export class Program {
	private server: Server
	constructor() {
		this.registerKeyEvents()
		const configuration = new Configuration(settings)
		DataStore.Initiate(configuration)
		this.server = new Server(configuration)
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
