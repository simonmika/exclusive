module Exclusive {
	export class User extends BackendUser {
		private path: string;
		get Path() { return this.path; }
		set Path(value: string) { this.path = path.join(value, this.name); }
		private name: string;
		get Name() { return this.name; }
		set Name(value: string) { this.name = value; }
		private url: string;
		get Url() { return this.url; }
		set Url(value: string) { this.url = path.join(value, 'data', 'users', this.name); }
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
			super(company, contact, crm);
		}
		public AddLog(address: string, method: string, httpPath: HttpPath, statusCode: number, onCompleted: (result: boolean, log: Log) => void) {
			var log = new Log(new Date(), address, method, httpPath, statusCode);
			fs.appendFile(path.join(this.path, 'log.csv'), log.toString() + "\n", 'utf-8', (error: any) => {
				if (error)
					onCompleted(false, null);
				else
					onCompleted(true, log);
			});
		}
		public CanRead(folder: string): boolean {
			return (this.contents.indexOf(folder) == -1) ? false : true;
		}
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
					fs.writeFile(path.join(this.path, 'meta.json'), super.ToJSON()/*this.backend.ToJSON()*/, 'utf-8', (error: any) => {
						if (error)
							onCompleted(false);
						else
							onCompleted(true);
					});
				}
			});
		}
		public Update(user: User) {
			if (user) {
				this.company = user.company;
				this.contact = user.contact;
				this.crm = user.crm;
				this.contents = user.Contents;
			}
		}
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
		public ToJSON(): string {
			var contents = "[";
			this.contents.forEach(content => {
				contents += "\"" + content + "\",";
			});
			if (contents != "[")
				contents = contents.slice(0, -1);
			contents += "]";
			return "{\n\"name\": \"" + this.name + "\",\n\"company\": \"" + this.company + "\",\n\"contact\": \"" + this.contact + "\",\n\"crm\": \"" + this.crm +
				"\",\n\"url\": \"http://" + this.url + "\",\n\"logUrl\": \"http://" + this.LogUrl + "\",\n\"folders\": " + contents + ",\n\"foldersUrl\": \"http://" + this.ContentsUrl + "\"\n}";
		}
	}
}
