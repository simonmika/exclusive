import * as Wappli from "../Wappli"

export class Settings extends Wappli.Page {
	constructor(private service: Wappli.Service) {
		super("Settings", "gear", true)
		this.Title = "Settings"
	}
	Setup() {
		const serverFieldValue = this.service.Server
		const userNameFieldValue = this.service.User
		const passwordFieldValue = this.service.Password
		let serverField: any
		let userNameField: any
		let passwordField: any
		this.Append(serverField = new Wappli.Field("server", "text", "Server", () => this.service.Server, value => this.service.Server = value))
		this.Append(userNameField = new Wappli.Field("userName", "text", "User Name", () => this.service.User, value => this.service.User = value))
		this.Append(passwordField = new Wappli.Field("password", "password", "Password", () => this.service.Password, value => this.service.Password = value))
		this.Append(new Wappli.Button("Log in", () => {
			this.service.SaveSettings()
			window.location.href = this.service.Server + "/app/"
		}))
		this.Append(new Wappli.Button("Cancel", () => {
			$.mobile.changePage(this.service.Server + "/app/", "slide")
			serverField.Value = serverFieldValue
			userNameField.Value = userNameFieldValue
			passwordField.Value = passwordFieldValue
		}))
	}
}
