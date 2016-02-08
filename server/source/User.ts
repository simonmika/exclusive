module Exclusive {
	export class User {
		private backend: BackendUser;
		private path: string;
		get Path() { return this.path; }
		set Path(value: string) { this.path = path.join(value, this.name); }
		private name: string;
		get Name() { return this.name; }
		set Name(value: string) { this.name = value; }
		private url: string;
		get Url() { return this.url; }
		set Url(value: string) { this.url = path.join(value, 'users', this.name); }
		private logUrl: string;
		get LogUrl() { return path.join(this.url, 'log'); }
		private logs: Log[] = [];
		get Logs() { return this.logs; }
		set Logs(value: Log[]) { this.logs = value; }
		private contentsUrl: string;
		get ContentsUrl() { return path.join(this.url, 'folders'); }
		private contents: string[] = [];
		get Contents() { return this.contents; }
		set Contents(value: string[]) { this.contents = value; }

		constructor(company: string, contact: string, crm: string) {
			this.backend = new BackendUser(company, contact, crm);
		}
		/**Adds a new log of type Log to this user.
		 * @param address Type of string of the IP address of this user.
		 * @param method Type of string of the request's method used.
		 * @param httpPath Type of HttpPath contains the path that this user was looking for.
		 * @param statusCode Type of number of the status code of the respose for this user's request. 
		 * @param onCompleted The callback is passed two arguments (result, log), where result is type of boolean and log type of log holds the new log added to this user.
		 */
		public AddLog(address: string, method: string, httpPath: HttpPath, statusCode: number, onCompleted: (result: boolean, log: Log) => void) {
			var log = new Log(new Date(), address, method, httpPath, statusCode);
			fs.appendFile(path.join(this.path, 'log.csv'), log.toString() + "\n", 'utf-8', (error: any) => {
				if (error)
					onCompleted(false, null);
				else
					onCompleted(true, log);
			});

		}
		/**Checks if this user has a folder in his contents.
		 * Returns true if the folder's name is in this user's contents. 
		 * @param folder String of the name of the folder.
		 */
		public CanRead(folder: string): boolean {
			return (this.contents.indexOf(folder) == -1) ? false : true;
		}
		/**Creats a new user by giving him a unique name, creating a new folder, saving an empty 'log.csv' file and adding him to DataStore.Users.
		 * @param hostName Type of string of the host's name.
		 * @param usersPath Type of string of the local path of users.
		 * @param onCompleted The callback is passed one argument (result) type of boolean holds the result of creating the user.
		 */
		public Create(hostName: string, usersPath: string, onCompleted: (result: boolean) => void) {
			this.name = User.GenerateName();
			this.Url = hostName;
			this.path = path.join(usersPath, this.name);
			DataStore.AddUser(this);
			fs.mkdir(this.path, (mkdirError: any) => {
				if (mkdirError)
					onCompleted(false);
				else {
					fs.writeFile(path.join(this.path, 'log.csv'), "", 'utf-8', (error: any) => {
						if (error)
							onCompleted(false);
						else
							this.Save((savingResult: boolean) => { onCompleted(savingResult); });
					});
				}
			});
		}
		/**Saves the user's 'contents.csv' and 'meta.json' of this user to the hard disk.
		 * @param onCompleted The callback is passed one argument (result) type of boolean holds the result of saving the two files.
		 */
		public Save(onCompleted: (result: boolean) => void) {
			var contents: string[];
			(this.contents) ? contents = this.contents : contents = [];
			var contentsAsOneString: string = "";
			for (var i = 0; i < contents.length; i++) {
				contentsAsOneString += contents[i] + "\n";
				if (i == contents.length - 1)
					contentsAsOneString = contentsAsOneString.slice(0, -1);
			}
			fs.writeFile(path.join(this.path, 'content.csv'), contentsAsOneString, 'utf-8', (error: any) => {
				if (error)
					onCompleted(false);
				else {
					fs.writeFile(path.join(this.path, 'meta.json'), this.backend.ToJSON(), 'utf-8', (error: any) => {
						if (error)
							onCompleted(false);
						else
							onCompleted(true);
					});
				}
			});
		}
		/**Updates this user's backend and contents.
		 * @param user Type of User contains the new updates of this user.
		 */
		public Update(user: User) {
			if (user) {
				this.backend.Company = user.backend.Company;
				this.backend.Contact = user.backend.Contact;
				this.backend.Crm = user.backend.Crm;
				this.contents = user.Contents;
			}
		}
		/**Generates a unique name for a new user.
		 * Returns a string of the new name. 
		 */
		private static GenerateName(): string {
			var result = "";
			var allUsers = DataStore.AllUsers();
			var fortsatt = true;
			while (fortsatt) {
				result = Math.random().toString(36).slice(-8);
				if (!(allUsers.indexOf(result) > -1))
					fortsatt = false;
			}
			return result;
		}
		/**Converts this user to JSON.
		 * Returns a string implements JSON standard of this user.
		 */
		public ToJSON(): string {
			var contents = "[";
			this.contents.forEach(content => {
				contents += "\"" + content + "\",";
			});
			if (contents != "[")
				contents = contents.slice(0, -1);
			contents += "]";
			return "{\n\"name\": \"" + this.name + "\",\n\"company\": \"" + this.backend.Company + "\",\n\"contact\": \"" + this.backend.Contact + "\",\n\"crm\": \"" + this.backend.Crm +
				"\",\n\"url\": \"http://" + this.url + "\",\n\"logUrl\": \"http://" + this.LogUrl + "\",\n\"folders\": " + contents + ",\n\"foldersUrl\": \"http://" + this.ContentsUrl + "\"\n}";
		}
	}
}