module Exclusive {
	 export module DataStore {
		export var Users: User[] = [];
		export var Content: string[] = [];
		var usersPath: string;
		var contentPath: string;
		export function Initiate(): void {
			usersPath = path.join(ServerConfiguration.DataLocalPath, 'users');
			contentPath = path.join(ServerConfiguration.DataLocalPath, 'content');
			LoadContent();
			LoadUsers();
			console.log("Data Loaded.");
		}
		export function AddUser(user: User): void {
			Users.push(user);
		}
		function RemoveEmptyLines(result: string[]): string[] {
			var i = 0;
			while (i < result.length) {
				if (result[i] == "" || result[i] == "\n") {
					result.splice(i, 1);
					i--;
				}
				i++;
			}
			return result;
		}
		function processLogs(logs: string[]): Log[] {
			var clearLogs = RemoveEmptyLines(logs);
			var result: Log[] = [];
			clearLogs.forEach(log => {
				var serperators = [',', ';'];
				var seperatedLog = log.split(new RegExp(serperators.join('|')));
				result.push(new Log(new Date(seperatedLog[0]), seperatedLog[1], seperatedLog[2], HttpPath.Build(seperatedLog[3]), Number(seperatedLog[4])))
			});
			return result;
		}
		function LoadContent(): void {
			Content = fs.readdirSync(contentPath);
		}
		function LoadUsers(): void {
			var folders: string[] = fs.readdirSync(usersPath);
			folders.forEach(folder => {
				var userFolder = path.join(usersPath, folder);
				var meta = JSON.parse(fs.readFileSync(path.join(userFolder, 'meta.json'), "utf-8"));
				var user = new User((meta.company) || (meta.Company), (meta.contact) || (meta.Contact), (meta.crm) || (meta.Crm));
				var contents: string[] = fs.readFileSync(path.join(userFolder, 'content.csv'), "utf-8").split("\n");
				user.Name = folder;
				user.Path = usersPath;
				user.Url = ServerConfiguration.HostName;
				user.Contents = RemoveEmptyLines(contents);
				if (fs.existsSync(path.join(userFolder, 'log.csv'))){
					var logs: string[] = fs.readFileSync(path.join(userFolder, 'log.csv'), "utf-8").split("\n");
					user.Logs = processLogs(logs);
				}
				AddUser(user);
			});
		}
		export function OpenUser(name: string): User {
			var BreakException = {};
			var result: User;
			try {
				Users.forEach(user => {
					if (user.Name == name) {
						result = user;
						throw BreakException;
					}
				});
			} catch (exception) { }
			return result;
		}
		export function AllUsers(): string[] {
			var result: string[] = [];
			Users.forEach(user => {
				result.push(user.Name);
			});
			return result;
		}
		export function UpdateUser(userName: string, log: Log): void {
			var updatedUser = OpenUser(userName);
			updatedUser.Logs.push(log);
		}
	}
}
