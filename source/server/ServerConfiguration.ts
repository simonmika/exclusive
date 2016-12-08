import * as fs from 'fs';
import * as path from 'path';

export module ServerConfiguration {
	export var BaseUrl: string;
	export var ListenPort: number;
	export var DataLocalPath: string;
	export var AppPath: string;
	export var AuthorisationServer: string;
	export var AuthorisationPath: string;
	export function ReadServerConfigurations(configFile: string): void {
		var configuration: any;
		try {
			configuration = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
		}
		catch (error) {
			console.error('WARNING: There was an error while reading the configuration file, falling back to defaults.\n' + error.toString());
		}
		if (!configuration)
			configuration = {}
		ServerConfiguration.BaseUrl = configuration.baseUrl ? configuration.baseUrl : 'http://localhost:8080/data/';
		if (!ServerConfiguration.BaseUrl.endsWith("/"))
			ServerConfiguration.BaseUrl += "/"	
		ServerConfiguration.ListenPort = configuration.listenPort ? configuration.listenPort : 8080;
		ServerConfiguration.DataLocalPath = path.resolve(configuration.data ? configuration.data : 'data', '');
		var absolutePath = path.resolve(configuration.build ? configuration.build : 'build', '');
		ServerConfiguration.AppPath = path.join(absolutePath, 'app');
		ServerConfiguration.AuthorisationServer = configuration.authorisationServer;
		ServerConfiguration.AuthorisationPath = configuration.authorisationPath;
	}
}
