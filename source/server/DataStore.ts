import { User } from "./User"
import { ServerConfiguration } from "./ServerConfiguration"
import { BackendUser } from "./BackendUser"
import { Log } from "./Log"
import { HttpPath } from "./HttpPath"

import * as fs from "fs"
import * as path from "path"

export class DataStore {
	static Users: User[] = []
	static Content: string[] = []
	private static usersPath: string
	private static contentPath: string
	static Initiate() {
		DataStore.usersPath = path.join(ServerConfiguration.DataLocalPath, "users")
		DataStore.contentPath = path.join(ServerConfiguration.DataLocalPath, "content")
		DataStore.LoadContent()
		DataStore.LoadUsers()
		console.log("Data Loaded.")
	}
	static AddUser(user: User): void {
		DataStore.Users.push(user)
	}
	private static RemoveEmptyLines(result: string[]): string[] {
		let i = 0
		while (i < result.length) {
			if (result[i] == "" || result[i] == "\n") {
				result.splice(i, 1)
				i--
			}
			i++
		}
		return result
	}
	private static processLogs(logs: string[], user: BackendUser): Log[] {
		let clearLogs = DataStore.RemoveEmptyLines(logs)
		let result: Log[] = []
		clearLogs.forEach(log => {
			const serperators = [",", ""]
			const seperatedLog = log.split(new RegExp(serperators.join("|")))
			result.push(new Log(new Date(seperatedLog[0]), seperatedLog[1], seperatedLog[2], HttpPath.Build(seperatedLog[3]), Number(seperatedLog[4]), user))
		})
		return result
	}
	private static LoadContent(): void {
		DataStore.Content = fs.readdirSync(DataStore.contentPath).filter((folderName: string) => {
			return folderName[0] != "."
		})
	}
	private static LoadUsers(): void {
		const folders: string[] = fs.readdirSync(DataStore.usersPath).filter((folderName: string) => {
			return folderName[0] != "."
		})
		folders.forEach(folder => {
			const userFolder = path.join(DataStore.usersPath, folder)
			const meta = JSON.parse(fs.readFileSync(path.join(userFolder, "meta.json"), "utf-8"))
			const user = new User((meta.company) || (meta.Company), (meta.contact) || (meta.Contact))
			const contents: string[] = fs.readFileSync(path.join(userFolder, "content.csv"), "utf-8").split("\n")
			user.Name = folder
			user.Path = DataStore.usersPath
			user.Url = ServerConfiguration.BaseUrl
			user.Contents = DataStore.RemoveEmptyLines(contents)
			if (fs.existsSync(path.join(userFolder, "log.csv"))){
				const logs: string[] = fs.readFileSync(path.join(userFolder, "log.csv"), "utf-8").split("\n")
				user.Logs = DataStore.processLogs(logs, user)
			}
			DataStore.AddUser(user)
		})
	}
	static OpenUser(name: string): User {
		const BreakException = {}
		let result: User
		try {
			DataStore.Users.forEach(user => {
				if (user.Name == name) {
					result = user
					throw BreakException
				}
			})
		} catch (exception) {
		}
		return result
	}
	static AllUsers(): string[] {
		let result: string[] = []
		DataStore.Users.forEach(user => {
			result.push(user.Name)
		})
		return result
	}
	static UpdateUser(userName: string, log: Log): void {
		const updatedUser = DataStore.OpenUser(userName)
		updatedUser.Logs.push(log)
	}
}
