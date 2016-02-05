module Imint.Exclusive.Client.UI {
	export class Settings extends Wappli.Page {
		constructor(private service: Wappli.Service) {
			super("Settings", "gear", true);
			this.Title = "Settings";
		}
		Setup() {
			this.Append(new Wappli.Field("server", "text", "Server", () => this.service.Server, value => this.service.Server = value));
			this.Append(new Wappli.Field("userName", "text", "User Name", () => this.service.User, value => this.service.User = value));
			this.Append(new Wappli.Field("password", "password", "Password", () => this.service.Password, value => this.service.Password = value));
		}
	}
}
