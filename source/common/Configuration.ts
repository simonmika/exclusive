import { IConfiguration } from "./IConfiguration"

import * as url from "url"

export class Configuration {
	readonly url: url.Url
	constructor(configuration: IConfiguration) {
		this.url = url.parse(configuration.url)
	}
}
