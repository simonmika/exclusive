import { ServerConfiguration } from "./ServerConfiguration"
import { DataStore } from "./DataStore"
import { HttpPath } from "./HttpPath"
import { Connection } from "./Connection"
import { User } from "./User"
import { Log } from "./Log"

import * as path from 'path';

export class Service {
	private users: string;
	get Users() { return this.content; }
	private content: string;
	get Content() { return this.content; }
	private app: string;
	get App() { return this.app; }
	private global_log: string;
	get GlobalLog() { return this.global_log; }
	constructor() {
		this.users = path.join(ServerConfiguration.DataLocalPath, 'users');
		this.content = path.join(ServerConfiguration.DataLocalPath, 'content');
		this.app = ServerConfiguration.AppPath;
		this.global_log = path.join(ServerConfiguration.DataLocalPath, 'global_log');
	}
	Process(connection: Connection, urlPath: HttpPath) {
		if (!urlPath || urlPath.Head.length <= 0) {
			connection.Authenticate((authenticated: boolean) => {
				if (authenticated) {
					var contents = Service.ToJSON(DataStore.Content);
					var toPrint = "{\n\"url\": \"" + ServerConfiguration.CreateUrl([]) + "\",\n";
					toPrint += "\"usersUrl\": \"" + ServerConfiguration.CreateUrl(['users']) + "\",\n";
					toPrint += "\"contentUrl\": \"" + ServerConfiguration.CreateUrl(['content']) + "\",\n";
					toPrint += "\"logUrl\": \"" + ServerConfiguration.CreateUrl(['global_log.csv']) + "\",\n";
					toPrint += "\"content\": " + contents + "\n}";
					connection.Write(toPrint, 200, { 'Content-Type': 'application/json; charset=UTF-8' });
				}
			});
		}
		else
			switch (urlPath.Head) {
				case "app":
					if (urlPath.Tail)
						connection.WriteFile(path.join(this.app, urlPath.Tail.ToString()));
					else
						connection.WriteFile(this.app);
					break;
				case "users":
					connection.Authenticate((authenticated: boolean) => {
						if (authenticated)
							this.ProcessUsers(connection, urlPath.Tail);
					});
					break;
				case "content":
					connection.Authenticate((authenticated: boolean) => {
						if (authenticated) {
							if (connection.Request.method == "GET")
								if (!urlPath.Tail)
									connection.Write(Service.ToJSON(DataStore.Content), 200, { 'Content-Type': 'application/json; charset=UTF-8' });
								else
									connection.WriteFile(path.join(this.content, urlPath.Tail.ToString()));
						}
					});
					break;
				case "global_log.csv":
					connection.Authenticate((authenticated: boolean) => {
						if (authenticated) {
							if (connection.Request.method == "GET") {
								connection.WriteFile(path.join(this.global_log, 'global_log.csv'));
							}
						}
					});
					break;
				default:
					switch (connection.Request.method) {
						case "GET":
							this.Get(connection, urlPath);
					}
					break;
			}
	}
	private ProcessUsers(connection: Connection, httpPath: HttpPath) {
		if (!httpPath || httpPath.Head.length <= 0) {
			switch (connection.Request.method) {
				case "GET":
					connection.WriteAllUsers();
					break;
				case "POST":
					connection.Receive((newUser: User) => {
						if (!newUser)
							connection.Write("Bad Request", 400, { 'Content-Type': 'text/html; charset=utf-8' });
						else {
							newUser.Create(ServerConfiguration.HostName, this.users, (created: boolean) => {
								if (!created)
									connection.Write("Internal Server Error", 500, { 'Content-Type': 'text/html; charset=utf-8' });
								else
									connection.Write(newUser.ToJSON(), 200, { 'Content-Type': 'application/json; charset=UTF-8' });
							});
						}
					});
					break;
			}
		}
		else {
			var user = DataStore.OpenUser(httpPath.Head);
			if (user)
				switch (httpPath.Tail ? httpPath.Tail.Head : "") {
					case "":
						switch (connection.Request.method) {
							case "GET":
								connection.Write(user.ToJSON(), 200, { 'Content-Type': 'application/json; charset=UTF-8' });
								break;
							case "PUT":
								connection.Receive((update) => {
									if (!update)
										connection.Write("Bad Request", 400, { 'Content-Type': 'text/html; charset=utf-8' });
									else {
										user.Update(update);
										user.Save((saved: boolean) => {
											if (!saved)
												connection.Write("Internal Server Error", 500, { 'Content-Type': 'text/html; charset=utf-8' });
											else
												connection.Write(user.ToJSON(), 200, { 'Content-Type': 'application/json; charset=UTF-8' });
										});
									}
								});
								break;
						}
						break;
					case "folders":
						if (connection.Request.method == "GET")
							connection.Write(Service.ToJSON(user.Contents), 200, { 'Content-Type': 'application/json; charset=UTF-8' });
						break;
					case "log":
						if (connection.Request.method == "GET")
							connection.Write(Service.ToJSON(user.Logs), 200, { 'Content-Type': 'application/json; charset=UTF-8' });
						break;
					default:
						connection.Write("Page Requested Not Found", 404, { 'Content-Type': 'text/html; charset=utf-8' });
						break;
				}
			else
				connection.Write("User Requested Not Found", 404, { 'Content-Type': 'text/html; charset=utf-8' });
		}
	}
	private Get(connection: Connection, httpPath: HttpPath) {
		var user = DataStore.OpenUser(httpPath.Head);
		if (user) {
			var address: string;
			if (connection.Request.headers['x-forwarded-for'])
				address = connection.Request.headers['x-forwarded-for'];
			else
				address = connection.Request.connection.remoteAddress;

			switch (httpPath.Tail ? httpPath.Tail.Head : "") {
				case "":
					connection.Write("Not Found", 404, { 'Content-Type': 'text/html; charset=utf-8' });
					user.AddLog(address, connection.Request.method, httpPath, 404, (appended: boolean, message: Log) => {
						if (appended)
							DataStore.UpdateUser(user.Name, message);
					});
					break;

				default:
					if (user.CanRead(httpPath.Tail.Head))
						connection.WriteFile(this.content + "/" + httpPath.Tail.ToString(), true, (statusCode: number) => {
							user.AddLog(address, connection.Request.method, httpPath, statusCode, (appended: boolean, message: Log) => {
								if (appended)
									DataStore.UpdateUser(user.Name, message);
							});
						});
					else {
						connection.Write("Not Found", 404, { 'Content-Type': 'text/html; charset=utf-8' })
						user.AddLog(address, connection.Request.method, httpPath, 404, (appended: boolean, message: Log) => {
							if (appended)
								DataStore.UpdateUser(user.Name, message);
						});
					}
			}
		}
		else
			connection.Write("Not Found", 404, { 'Content-Type': 'text/html; charset=utf-8' })
	}
	static ToJSON(file: any[]): string {
		var result = "[\n";
		if (file)
			file.forEach(directory => {
				result += "\"" + directory.toString() + "\",\n";
			});
		if (result != "[\n")
			result = result.slice(0, -2);
		return result += "\n]";
	}
}
