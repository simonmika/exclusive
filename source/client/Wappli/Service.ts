export interface ISettings {
	server: string
	user?: string
	password?: string
}

export class Service {
	private settings: ISettings
	get Server(): string { return this.settings.server }
	set Server(value: string) {
		this.settings.server = value
	}
	get User(): string { return this.settings.user }
	set User(value: string) {
		this.settings.user = value
		this.UpdateAuthorization()
	}
	get Password(): string { return this.settings.password }
	set Password(value: string) {
		this.settings.password = value
		this.UpdateAuthorization()
	}
	private authorization: string
	constructor(private name: string, private defaultSettings: ISettings, private changed: () => void) {
		this.LoadSettings()
	}
	private LoadSettings() {
		const settings: ISettings = JSON.parse(localStorage.getItem(this.name + ".settings"))
		this.settings = settings ? settings : this.defaultSettings
		this.UpdateAuthorization()
		this.changed()
	}
	public SaveSettings() {
		localStorage.setItem(this.name + ".settings", JSON.stringify(this.settings))
		this.LoadSettings()
	}
	private UpdateAuthorization() {
		this.authorization = "Basic " + btoa(this.User + ":" + this.Password)
	}
	Get<T>(url: string, success: (data: T) => void) {
		$.mobile.loading("show")
		$.ajax({
			url,
			dataType: "json",
			beforeSend: header => header.setRequestHeader("Authorization", this.authorization),
			success: (data: T) => {
				$.mobile.loading("hide")
				success(data)
			},
			error: () => {
				$.mobile.loading("hide")
				success(null)
			},
		})
	}
	Post<T>(url: string, data: T, done: (data: T) => void = null) {
		$.mobile.loading("show")
		$.ajax({
			type: "POST",
			url,
			data: JSON.stringify(data),
			dataType: "json",
			contentType: "application/json charset=utf-8",
			beforeSend: header => header.setRequestHeader("Authorization", this.authorization),
			success: (d: T) => {
				$.mobile.loading("hide")
				done(d)
			},
			error: () => {
				$.mobile.loading("hide")
				done(null)
			},
		})
	}
	Put<T>(url: string, data: T, done: (data: T) => void = null) {
		$.mobile.loading("show")
		$.ajax({
			type: "PUT",
			url,
			data: JSON.stringify(data),
			dataType: "json",
			contentType: "application/json charset=utf-8",
			beforeSend: header => header.setRequestHeader("Authorization", this.authorization),
			success: (d: T) => {
				$.mobile.loading("hide")
				done(d)
			},
			error: () => {
				$.mobile.loading("hide")
				done(null)
			},
		})
	}
}
