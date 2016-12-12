import { Configuration } from "./Configuration"
import { DataStore } from "./DataStore"
import { HttpPath } from "./HttpPath"
import { Connection } from "./Connection"
import { User } from "./User"
import { Log } from "./Log"

import * as path from "path"

export class Service {
	get Users() { return this.configuration.usersFolder }
	get Content() { return this.configuration.contentFolder }
	get App() { return this.configuration.storage + "/app" }
	get GlobalLog() { return this.configuration.storage + "/global_log.csv" }
	constructor(private configuration: Configuration) {
	}
	Process(connection: Connection, urlPath: HttpPath) {
		if (!urlPath || urlPath.Head.length <= 0) {
			connection.Authenticate((authenticated: boolean) => {
				if (authenticated) {
					const contents = Service.ToJSON(DataStore.Content)
					const toPrint = "{\n\"url\": \"" + connection.CreateUrl([]) + "\",\n" +
						"\"usersUrl\": \"" + connection.CreateUrl(["users"]) + "\",\n" +
						"\"contentUrl\": \"" + connection.CreateUrl(["content"]) + "\",\n" +
						"\"logUrl\": \"" + connection.CreateUrl(["global_log.csv"]) + "\",\n" +
						"\"content\": " + contents + "\n}"
					connection.Write(toPrint, 200, { "Content-Type": "application/json; charset=UTF-8" })
				}
			})
		} else
			switch (urlPath.Head) {
				case "app":
					if (urlPath.Tail)
						connection.WriteFile(path.join(this.App, urlPath.Tail.ToString()))
					else
						connection.WriteFile(this.App)
					break
				case "users":
					connection.Authenticate((authenticated: boolean) => {
						if (authenticated)
							this.ProcessUsers(connection, urlPath.Tail)
					})
					break
				case "content":
					connection.Authenticate((authenticated: boolean) => {
						if (authenticated) {
							if (connection.Request.method == "GET")
								if (!urlPath.Tail)
									connection.Write(Service.ToJSON(DataStore.Content), 200, { "Content-Type": "application/json; charset=UTF-8" })
								else
									connection.WriteFile(path.join(this.Content, urlPath.Tail.ToString()))
						}
					})
					break
				case "global_log.csv":
					connection.Authenticate((authenticated: boolean) => {
						if (authenticated) {
							if (connection.Request.method == "GET") {
								connection.WriteFile(path.join(this.GlobalLog, "global_log.csv"))
							}
						}
					})
					break
				default:
					switch (connection.Request.method) {
						case "GET":
							this.Get(connection, urlPath)
							break
						default:
							break
					}
					break
			}
	}
	private ProcessUsers(connection: Connection, httpPath: HttpPath) {
		if (!httpPath || httpPath.Head.length <= 0) {
			switch (connection.Request.method) {
				case "GET":
					connection.WriteAllUsers()
					break
				case "POST":
					connection.Receive((newUser: User) => {
						if (!newUser)
							connection.Write("Bad Request", 400, { "Content-Type": "text/html; charset=utf-8" })
						else {
							newUser.Create(this.configuration.url.href, this.Users.toString(), (created: boolean) => {
								if (!created)
									connection.Write("Internal Server Error", 500, { "Content-Type": "text/html; charset=utf-8" })
								else
									connection.Write(newUser.ToJSON(), 200, { "Content-Type": "application/json; charset=UTF-8" })
							})
						}
					})
					break
				default:
					break
			}
		}
		else {
			const user = DataStore.OpenUser(httpPath.Head)
			if (user)
				switch (httpPath.Tail ? httpPath.Tail.Head : "") {
					case "":
						switch (connection.Request.method) {
							case "GET":
								connection.Write(user.ToJSON(), 200, { "Content-Type": "application/json; charset=UTF-8" })
								break
							case "PUT":
								connection.Receive((update) => {
									if (!update)
										connection.Write("Bad Request", 400, { "Content-Type": "text/html; charset=utf-8" })
									else {
										user.Update(update)
										user.Save((saved: boolean) => {
											if (!saved)
												connection.Write("Internal Server Error", 500, { "Content-Type": "text/html; charset=utf-8" })
											else
												connection.Write(user.ToJSON(), 200, { "Content-Type": "application/json; charset=UTF-8" })
										})
									}
								})
								break
							default:
								break
						}
						break
					case "folders":
						if (connection.Request.method == "GET")
							connection.Write(Service.ToJSON(user.Contents), 200, { "Content-Type": "application/json; charset=UTF-8" })
						break
					case "log":
						if (connection.Request.method == "GET")
							connection.Write(Service.ToJSON(user.Logs), 200, { "Content-Type": "application/json; charset=UTF-8" })
						break
					default:
						connection.Write("Page Requested Not Found", 404, { "Content-Type": "text/html; charset=utf-8" })
						break
				}
			else
				connection.Write("User Requested Not Found", 404, { "Content-Type": "text/html; charset=utf-8" })
		}
	}
	private Get(connection: Connection, httpPath: HttpPath) {
		const user = DataStore.OpenUser(httpPath.Head)
		if (user) {
			let address: string
			if (connection.Request.headers["x-forwarded-for"])
				address = connection.Request.headers["x-forwarded-for"]
			switch (httpPath.Tail ? httpPath.Tail.Head : "") {
				case "":
					connection.Write("Not Found", 404, { "Content-Type": "text/html; charset=utf-8" })
					user.AddLog(address, connection.Request.method, httpPath, 404, (appended: boolean, message: Log) => {
						if (appended)
							DataStore.UpdateUser(user.Name, message)
					})

				default:
					if (user.CanRead(httpPath.Tail.Head))
						connection.WriteFile(this.Content + "/" + httpPath.Tail.ToString(), true, (statusCode: number) => {
							user.AddLog(address, connection.Request.method, httpPath, statusCode, (appended: boolean, message: Log) => {
								if (appended)
									DataStore.UpdateUser(user.Name, message)
							})
						})
					else {
						connection.Write("Not Found", 404, { "Content-Type": "text/html; charset=utf-8" })
						user.AddLog(address, connection.Request.method, httpPath, 404, (appended: boolean, message: Log) => {
							if (appended)
								DataStore.UpdateUser(user.Name, message)
						})
					}
			}
		}
		else
			connection.Write("Not Found", 404, { "Content-Type": "text/html; charset=utf-8" })
	}
	static ToJSON(file: any[]): string {
		let result = "[\n"
		if (file)
			file.forEach(directory => {
				result += "\"" + directory.toString() + "\",\n"
			})
		if (result != "[\n")
			result = result.slice(0, -2)
		return result += "\n]"
	}
}
