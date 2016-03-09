/// <reference path="IRoot.ts"/>
/// <reference path="User.ts"/>
/// <reference path="../wappli/Collection.ts"/>

module Imint.Exclusive.Client.Data {
	export class Backend {
		private service: Wappli.Service;
		public get Service() { return this.service; }
		private root: Wappli.Resource<IRoot>;
		public get Root() { return this.root; }
		private content: Wappli.Collection<string>;
		public get Content() { return this.content; }
		private users: Wappli.Collection<User>;
		public get Users() { return this.users; }
		private log: Wappli.Collection<string>;
		public get Log() { return this.log; }
		private globalLog: Wappli.Resource<IRoot>;
		public get GlobalLog() { return this.globalLog }
		constructor() {
			this.service = new Wappli.Service("exclusive", () => {
				if (this.root !== undefined)
					this.root.Invalidate();
			});
			this.root = new Wappli.Resource<IRoot>(this.service, (action: (url: string) => void) => action(this.service.Server));
			this.content = new Wappli.Collection<string>(this.service, (action: (url: string) => void) => this.Root.Get((root) => action(root.contentUrl)));
			this.users = new Wappli.Collection<User>(this.service, (action: (url: string) => void) => this.Root.Get((root) => action(root.usersUrl)));
			this.Root.OnInvalidate(() => {
				this.Content.Invalidate();
				this.Users.Invalidate();
			});
			this.log = new Wappli.Collection<string>(this.service, (action: (url: string) => void) => this.Users.Current.Get((user) => action(user.logUrl)));
			this.Users.Current.OnInvalidate((value) => this.Log.Invalidate());
			this.globalLog = new Wappli.Resource<IRoot>(this.service, (action: (url: string) => void) => this.Root.Get((root) => action(root.logUrl)));
		}
	}
}
