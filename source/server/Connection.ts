import { DataStore } from "./DataStore"
import { User } from "./User"
import { ServerConfiguration } from "./ServerConfiguration"

import * as fs from "fs"
import * as http from "http"
import * as https from "https"
import * as path from "path"
import * as url from "url"

export class Connection {
	private requestUrl: string
	private requestPath: string
	get Request() { return this.request }
	get Response() { return this.response }

	private authorisation: any
	constructor(private parsedUrl: url.Url, private request: http.IncomingMessage, private response: http.ServerResponse) {
		this.requestUrl = parsedUrl.href
		this.requestPath = parsedUrl.path
		this.request = request
		this.response = response
		this.authorisation = request.headers.authorization
	}
	CreateUrl(path?: string[]) {
		return ServerConfiguration.BaseUrl + (path ? path.join("/") : "")
	}

	Write(message: string, statusCode: number, headers: any) {
		this.response.writeHead(statusCode, http.STATUS_CODES[statusCode], headers)
		this.response.write(message)
		this.response.end()
	}
	WriteAllUsers() {
		this.response.writeHead(200, "ok", { "Content-Type": "application/json" })
		let i = 0
		let toPrint = "[\n"
		while (i < DataStore.Users.length) {
			if (i != 0)
				toPrint = ""
			for (let n = 0; i < DataStore.Users.length && n < 50; n++, i++)
				toPrint += DataStore.Users[i].ToJSON() + ",\n"
			if (i != DataStore.Users.length)
				this.response.write(toPrint)
		}
		if (toPrint != "[\n")
			toPrint = toPrint.slice(0, -2)
		toPrint += "\n]"
		this.response.write(toPrint)
		this.response.end()
	}
	WriteFile(file: string, log?: boolean, onCompleted?: (statusCode: number) => void) {
		if (this.requestPath.substr(-1) == "/")
				file = path.join(file, "index.html")
		fs.stat(file, (error: any, stats: any) => {
			if (error) {
				this.Write("", 404, { "Content-Type": "text/html" })
				if (onCompleted)
					onCompleted(404)
			}
			else {
			if (stats.isDirectory()) {
				this.Write("Redirecting", 301, { Location: this.requestUrl + "/" })
				if (onCompleted)
					onCompleted(301)
			}
			else {
				// tslint:disable-next-line:no-shadowed-variable
				fs.readFile(file, (error: any, data: any) => {
					if (data) {
						const contentType = Connection.ContentType(file)
						if (stats.size) {
							if ((this.request.headers.range) && (this.request.headers.range.split("=")[0] == "bytes")) {
								const positions = this.request.headers.range.replace(/bytes=/, "").split("-")
								const start = parseInt(positions[0], 10)
								const total = stats.size
								const end = positions[1] ? parseInt(positions[1], 10) : total - 1
								const chunksize = (end - start) + 1
								this.response.writeHead(206, { "Content-Range": "bytes" + start + "-" + end + "/" + total, "Accept-Ranges": "bytes", "Content-Length": chunksize, "Content-Type": contentType })
								const stream = fs.createReadStream(file, { start, end })
									.on("open", () => {
										stream.pipe(this.response)
									}).on("error", (err: any) => {
										this.response.end(err)
									})
								if (onCompleted)
									onCompleted(206)
							}
							else {
								this.Write(data, 200, { "Accept-Ranges": "bytes", "Content-Lenth": stats.size, "Content-Type": contentType })
								if (onCompleted)
									onCompleted(200)
							}
						}
						else {
							this.Write(data, 200, { "Content-Type": contentType })
							if (onCompleted)
								onCompleted(200)
						}
					}
					else {
						if (log) {
							this.Write("Moved Permanently", 301, { "Content-Type": "text/html" })
							if (onCompleted)
								onCompleted(301)
						}
						else {
							this.Write("Not Found", 404, { "Content-Type": "text/html" })
							if (onCompleted)
								onCompleted(404)
						}
					}
				})
			}
			}
		})
	}
	Receive(onCompleted: (result: User) => void) {
		let result: User
		this.ReceivingData((fullbody) => {
			if (fullbody) {
				let contents: string[] = []
				const jsonUser = JSON.parse(fullbody)
				if ((jsonUser.company || jsonUser.Company) && (jsonUser.contact || jsonUser.Contact)) {
					let theCompany: string
					let theContact: string
					theCompany = jsonUser.company ? jsonUser.company : jsonUser.Company
					theContact = jsonUser.contact ? jsonUser.contact : jsonUser.Contact
					result = new User(theCompany, theContact)
					if ((jsonUser.folders) || (jsonUser.Folders)) {
						let theFolders: string[]
						(jsonUser.folders) ? theFolders = jsonUser.folders : theFolders = jsonUser.Folders
						contents = contents.concat(theFolders)
					}
					result.Contents = contents
					onCompleted(result)
				}
				else
					onCompleted(null)
			}
			else
				onCompleted(null)
		})
	}
	private ReceivingData(callback: (result: string) => void) {
		let fullBody: string = ""
		this.request.on("data", (chunk: string) => {
			fullBody += chunk
		})
		this.request.on("end", () => {
			callback(fullBody)
		})
	}
	Authenticate(onCompleted: (result: boolean) => void) {
		if (!this.authorisation)
			this.Write("Authorisation Required", 401, { "WWW-Authenticate": "Basic realm=\"imint.se\"" })
		else {
			const basic: any[] = this.IsBasicAuthorisation()
			if (basic[0]) {
				const credential = this.ParseBasicAuthorisation(basic[1])
				this.ValidateCredential(credential[0], credential[1], (result: boolean) => {
					if (!result)
						this.Write("Unauthorised", 401, { "WWW-Authenticate": "Basic realm=\"imint.se\"" })
					onCompleted(result)
				})
			}
			else this.Write("Basic Authorisation Required", 401, { "WWW-Authenticate": "Basic realm=\"imint.se\"" })
		}
	}
	private IsBasicAuthorisation(): any[] {
		const authorisation = this.authorisation.split(" ")
		return (authorisation[0] == "Basic") ? [true, authorisation[1]] : [false, null]
	}
	private ParseBasicAuthorisation(basicAuthorisation: any): string[] {
		return (new Buffer(basicAuthorisation, "base64")).toString().split(":")
	}
	private ValidateCredential(userName: string, password: string, callback: (result: boolean) => void) {
		if (ServerConfiguration.AuthorisationServer && ServerConfiguration.AuthorisationServer != "") {
			https.get({ hostname: ServerConfiguration.AuthorisationServer, path: ServerConfiguration.AuthorisationPath, auth: userName + ":" + password }, (response: http.IncomingMessage) => {
				if (response.statusCode == 200)
					callback(true)
				else
					callback(false)
			}).on("error", (error: any) => {
				console.log("There was an error when validating credentials.\n" + error.toString())
				callback(false)
			})
		}
		else // If no configuration is given, always authorize
			callback(true)
	}
	private static ContentType(file: string): string {
		const contentTypes = {".html": "text/html charset=utf8",
			".txt": "text/plain",
			".js": "application/javascript",
			".gif": "image/gif",
			".json": "application/json charset=UTF-8",
			".css": "text/css charset=UTF-8",
			".csv": "text/csv charset=UTF-8",
			".mp4": "video/mp4",
			".webm": "video/webm",
			".png": "image/png",
			".jpg": "image/jpeg",
			".jpeg": "image/jpeg",
			".svg": "image/svg+xml",
			".pdf": "application/pdf",
			".xml": "application/xml",
			".zip": "application/zip"}
		return (path.extname(file) in contentTypes) ? contentTypes[path.extname(file)] : null
	}
}
