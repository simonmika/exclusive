module Exclusive {
	export module ServerConfiguration {
		export var HostName: string;
		export var Port: number;
		export var Protocol: string;
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
			ServerConfiguration.HostName = configuration.hostName ? configuration.hostName : 'localhost';
			ServerConfiguration.Port = configuration.port ? configuration.port : 8080;
			ServerConfiguration.Protocol = configuration.protocol ? configuration.protocol : 'http';
			ServerConfiguration.DataLocalPath = path.resolve(configuration.data ? configuration.data : 'data', '');
			var absolutePath = path.resolve(configuration.build ? configuration.build : 'build', '');
			ServerConfiguration.AppPath = path.join(absolutePath, 'app');
			ServerConfiguration.AuthorisationServer = configuration.authorisationServer;
			ServerConfiguration.AuthorisationPath = configuration.authorisationPath;
		}
	}
}
