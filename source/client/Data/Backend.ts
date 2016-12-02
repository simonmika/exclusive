import { IRoot } from "././IRoot"
import { User } from "./User"
import * as Wappli from "../Wappli"

export class Backend {
	private service: Wappli.Service;
	get Service() { return this.service; }
	private root: Wappli.Resource<IRoot>;
	get Root() { return this.root; }
	private content: Wappli.Collection<string>;
	get Content() { return this.content; }
	private users: Wappli.Collection<User>;
	get Users() { return this.users; }
	private log: Wappli.Collection<string>;
	get Log() { return this.log; }
	private globalLog: Wappli.Resource<IRoot>;
	get GlobalLog() { return this.globalLog }
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
