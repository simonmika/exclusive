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
			this.Append(new Wappli.Button("Log in", () => {
				this.service.SaveSettings();
				this.service.Get(this.service.Server + "/app/", () => {
					var root = new Imint.Exclusive.Client.UI.Root(new Imint.Exclusive.Client.Data.Backend());
					root.Initialize();
					$.mobile.changePage(this.service.Server + "/app/", "slide");
				});
			}));
			this.Append(new Wappli.Button("Cancel", () => {
				$.mobile.changePage(this.service.Server + "/app/", "slide");
			}));
		}
	}
}
