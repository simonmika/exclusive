export class Service {
	private server: string;
	get Server(): string { return this.server; }
	set Server(value: string) {
		this.server = value;
	}
	private user: string;
	get User(): string { return this.user; }
	set User(value: string) {
		this.user = value;
		this.UpdateAuthorization();
	}
	private password: string;
	get Password(): string { return this.password; }
	set Password(value: string) {
		this.password = value;
		this.UpdateAuthorization();
	}
	private authorization: string;
	constructor(private name: string, private changed: () => void) {
		this.LoadSettings();
	}
	private LoadSettings() {
		var settings: { server: string; user: string; password: string };
		settings = JSON.parse(localStorage.getItem(this.name + ".settings"));
		if (settings !== null) {
			this.server = settings.server;
			this.user = settings.user;
			this.password = settings.password;
		} else {
			this.server = "http://localhost:8080/data";
			this.user = "user";
			this.password = "password";
		}
		this.UpdateAuthorization();
		this.changed();
	}
	public SaveSettings() {
		var settings = { server: this.server, user: this.user, password: this.password };
		localStorage.setItem(this.name + ".settings", JSON.stringify(settings));
		this.LoadSettings();
	}
	private UpdateAuthorization() {
		this.authorization = "Basic " + btoa(this.user + ":" + this.password);
	}
	Get<T>(url: string, success: (data: T) => void) {
		$.mobile.loading("show");
		$.ajax({
			url: url,
			dataType: "json",
			beforeSend: header => header.setRequestHeader("Authorization", this.authorization),
			success: (data: T) => {
				$.mobile.loading("hide");
				success(data);
			},
			error: () => {
				$.mobile.loading("hide");
				success(null);
			}
		});
	}
	Post<T>(url: string, data: T, done: (data: T) => void = null) {
		$.mobile.loading("show");
		$.ajax({
			type: "POST",
			url: url,
			data: JSON.stringify(data),
			dataType: "json",
			contentType: "application/json; charset=utf-8",
			beforeSend: header => header.setRequestHeader("Authorization", this.authorization),
			success: (data: T) => {
				$.mobile.loading("hide");
				done(data);
			},
			error: () => {
				$.mobile.loading("hide");
				done(null);
			}
		});
	}
	Put<T>(url: string, data: T, done: (data: T) => void = null) {
		$.mobile.loading("show");
		$.ajax({
			type: "PUT",
			url: url,
			data: JSON.stringify(data),
			dataType: "json",
			contentType: "application/json; charset=utf-8",
			beforeSend: header => header.setRequestHeader("Authorization", this.authorization),
			success: (data: T) => {
				$.mobile.loading("hide");
				done(data);
			},
			error: () => {
				$.mobile.loading("hide");
				done(null);
			}
		});
	}
}
