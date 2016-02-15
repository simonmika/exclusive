module Imint.Exclusive.Client.UI {
	export class Settings extends Wappli.Page {
		constructor(private service: Wappli.Service) {
			super("Settings", "gear", true);
			this.Title = "Settings";
		}
		Setup() {
			var serverFieldValue = this.service.Server;
			var userNameFieldValue = this.service.User;
			var passwordFieldValue = this.service.Password;
			var serverField: any;
			var userNameField: any;
			var passwordField: any;
			this.Append(serverField = new Wappli.Field("server", "text", "Server", () => this.service.Server, value => this.service.Server = value));
			this.Append(userNameField = new Wappli.Field("userName", "text", "User Name", () => this.service.User, value => this.service.User = value));
			this.Append(passwordField = new Wappli.Field("password", "password", "Password", () => this.service.Password, value => this.service.Password = value));
			this.Append(new Wappli.Button("Log in", () => {
				this.service.SaveSettings();
				window.location.href = this.service.Server + "/app/";
			}));
			this.Append(new Wappli.Button("Cancel", () => {
				$.mobile.changePage(this.service.Server + "/app/", "slide");
				serverField.Value = serverFieldValue;
				userNameField.Value = userNameFieldValue;
				passwordField.Value = passwordFieldValue;
			}));
		}
	}
}
