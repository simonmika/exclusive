module Exclusive {
	export module ServerConfiguration {
		export var HostName: string;
		export var Port: number;
		export var DataLocalPath: string;
		export var AppPath: string;
		export var AuthorisationServer: string;
		export var AuthorisationPath: string;

		export function ReadServerConfigurations(configurationFile: string): void {
			try {
				var configuration = JSON.parse(fs.readFileSync(configurationFile, 'utf-8'));
				ServerConfiguration.HostName = configuration.hostName;
				ServerConfiguration.Port = configuration.port;
				ServerConfiguration.DataLocalPath = configuration.dataLocalPath;
				ServerConfiguration.AppPath = configuration.appPath;
				ServerConfiguration.AuthorisationServer = configuration.authorisationServer;
				ServerConfiguration.AuthorisationPath = configuration.authorisationPath;
			}
			catch (Error) {
				console.log("There was an error while reading the configuration file, unable to continue.\n" + Error.toString());
				process.exit(1);
			}
		}
	}
}