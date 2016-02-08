module Exclusive {
	/**Contains all data required for Exclusive. */
	export module DataStore {
		/**List of Exclusive.User of all users in Exclusive. */
		export var Users: User[] = [];
		/**List of strings of all contents' names in Exclusive. */
		export var Content: string[] = [];
		/**The local path where all users are saved in Exclusive. */
		var usersPath: string;
		/**the local path where the contents are saved in Exclusive. */
		var contentPath: string;
		/**Initiates the data store by loading all users and contents.
		 * It reads the contents folder, all users' meta-data, contents and logs.
		 * @param dataPath The local path of the data.
		 * @param host The name of the host.
		 */
		export function Initiate(): void {
			usersPath = path.join(Exclusive.DataPath, 'users');
			contentPath = path.join(Exclusive.DataPath, 'content');
			LoadContent();
			LoadUsers();
			console.log("Data Loaded.");
		}
		/**Adds a user of type Exclusive.User to the data store. 
		 * @param user New user to add.
		 */
		export function AddUser(user: User): void {
			Users.push(user);
		}
		/**Removes the empty lines or "\n" from an array of strings.
		 * Returns an array of strings contains no empty lines or "\n".
		 * @param result The array which contains empty lines or "\n".
		 */
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
		/**Converts the read logs from an array of strings to an array of Logs.
		 * Returns an array of Logs.
		 * @param logs array of strings of read logs from the hard disk.
		 */
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
		/**Synchronously reads the directories' names in content folder and adds them to DataStore.Content. */
		function LoadContent(): void {
			Content = fs.readdirSync(contentPath);
		}
		/**Synchronously reads all users of Exclusive and adds them to DataStore.Users. */
		function LoadUsers(): void {
			var folders: string[] = fs.readdirSync(usersPath);
			folders.forEach(folder => {
				var userFolder = path.join(usersPath, folder);
				var meta = JSON.parse(fs.readFileSync(path.join(userFolder, 'meta.json'), "utf-8"));
				var user = new User((meta.company) || (meta.Company), (meta.contact) || (meta.Contact), (meta.crm) || (meta.Crm));
				var contents: string[] = fs.readFileSync(path.join(userFolder, '/content.csv'), "utf-8").split("\n");
				user.Name = folder;
				user.Path = usersPath;
				user.Url = Exclusive.HostName;
				user.Contents = RemoveEmptyLines(contents);
				if (fs.existsSync(path.join(userFolder, 'log.csv'))){
					var logs: string[] = fs.readFileSync(path.join(userFolder, 'log.csv'), "utf-8").split("\n");
					user.Logs = processLogs(logs);
				}
				AddUser(user);
			});
		}
		/**Opens a user by passing the name of the required user.
		 * Returns object of Exclusive.User.
		 * @param name Name of the required user.
		 */
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
		/**Returns an array of strings of all users names.*/
		export function AllUsers(): string[] {
			var result: string[] = [];
			Users.forEach(user => {
				result.push(user.Name);
			});
			return result;
		}
		/**Updates a user's log in the data store by adding a new log to his Logs array.
		 * @param userName The user's name to add the new log to.
		 * @param log The new log to add.
		 */
		export function UpdateUser(userName: string, log: Log): void {
			var updatedUser = OpenUser(userName);
			updatedUser.Logs.push(log);
		}
	}
}
