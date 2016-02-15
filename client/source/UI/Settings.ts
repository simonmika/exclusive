module Imint.Exclusive.Client.UI {
	export class Settings extends Wappli.Page {
		constructor(private service: Wappli.Service) {
			super("Settings", "gear", true);
			this.Title = "Settings";
		}
		Setup() {
			var serverFieldValue: any;  
			var serverField = new Wappli.Field("server", "text", "Server", () => this.service.Server, value => this.service.Server = value);
			this.Append(serverField);
			var userNameFieldValue: any;
			var userNameField = new Wappli.Field("userName", "text", "User Name", () => this.service.User, value => this.service.User = value); 
			this.Append(userNameField);
			var passwordFieldValue: any;
			var passwordField = new Wappli.Field("password", "password", "Password", () => this.service.Password, value => this.service.Password = value); 
			this.Append(passwordField);
			this.Append(new Wappli.Button("Log in", () => {
				this.service.SaveSettings();
				window.location.href = this.service.Server + "/app/";
			}));
			this.Append(new Wappli.Button("Cancel", () => {
				$.mobile.changePage(this.service.Server + "/app/", "slide");
				serverField.Value = this.service.Server;
				userNameField.Value = this.service.User;
				passwordField.Value = this.service.Password;
			}));
		}
	}
}
