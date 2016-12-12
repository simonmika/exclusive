import { IConfiguration } from "./IConfiguration"
import * as common from "../common"

import * as url from "url"
import * as path from "path"

export class Configuration extends common.Configuration {
	readonly listen: url.Url
	get listenPort(): number { return parseInt(this.listen.port, 10) }
	readonly storage: string
	get usersFolder(): string { return path.resolve(this.storage, "./users") }
	get contentFolder(): string { return path.resolve(this.storage, "./content") }
	readonly clientFolder: string
	constructor(configuration: IConfiguration) {
		super(configuration)
		this.listen = configuration && configuration.listen ? url.parse(configuration.listen) : this.url
		this.storage = path.resolve(configuration && configuration.storage || "./data")
		this.clientFolder = path.resolve("../client", __dirname)
		this.authenticate = configuration && configuration.authenticate || ((user, callback) => callback(true))
	}
	readonly authenticate: (user: { name: string, password: string }, callback: (result: boolean) => void) => void
}
