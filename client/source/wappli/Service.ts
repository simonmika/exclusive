/// <reference path="../lib/jquery.d.ts"/>
/// <reference path="../lib/jquerymobile.d.ts"/>
module Wappli{
	export class Service {
		private server: string;
		get Server(): string { return this.server; }
		set Server(value: string) {
			this.server = value;
			this.SaveSettings();
		}
		private user: string;
		get User(): string { return this.user; }
		set User(value: string) {
			this.user = value;
			this.UpdateAuthorization();
			this.SaveSettings();
		}
		private password: string;
		get Password(): string { return this.password; }
		set Password(value: string) {
			this.password = value;
			this.UpdateAuthorization();
			this.SaveSettings();
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
				this.server = "https://aurora.imint.se/data";
				this.user = "";
				this.password = "";
			}
			this.UpdateAuthorization();
			this.changed();
		}
		private SaveSettings() {
			var settings = { server: this.server, user: this.user, password: this.password };
			localStorage.setItem(this.name + ".settings", JSON.stringify(settings));
			this.changed();
		}
		private UpdateAuthorization() {
			this.authorization = "Basic " + btoa(this.user + ":" + this.password);
		}
		Get<T>(url: string, success: (data: T) => void) {
			$.ajax({
				url: url,
				dataType: "json",
				beforeSend: header => header.setRequestHeader("Authorization", this.authorization),
				success: (data: T) => {
					success(data);
				},
				error: () => {
					success(null);
				}
			});
		}
		Post<T>(url: string, data: T, done: (data: T) => void = null) {
			$.ajax({
				type: "POST",
				url: url,
				data: JSON.stringify(data),
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				beforeSend: header => header.setRequestHeader("Authorization", this.authorization),
				success: (data: T) => { done(data); },
				error: () => { done(null); }
			});
		}
		Put<T>(url: string, data: T, done: (data: T) => void = null) {
			$.ajax({
				type: "PUT",
				url: url,
				data: JSON.stringify(data),
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				beforeSend: header => header.setRequestHeader("Authorization", this.authorization),
				success: (data: T) => { done(data); },
				error: () => { done(null); }
			});
		}
    }
}
