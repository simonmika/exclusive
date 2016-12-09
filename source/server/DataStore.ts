import { User } from "./User"
import { ServerConfiguration } from "./ServerConfiguration"
import { BackendUser } from "./BackendUser"
import { Log } from "./Log"
import { HttpPath } from "./HttpPath"

import * as fs from "fs"
import * as path from "path"

export module DataStore {
	export let Users: User[] = []
	export let Content: string[] = []
	let usersPath: string
	let contentPath: string
	export function Initiate(): void {
		usersPath = path.join(ServerConfiguration.DataLocalPath, "users")
		contentPath = path.join(ServerConfiguration.DataLocalPath, "content")
		LoadContent()
		LoadUsers()
		console.log("Data Loaded.")
	}
	export function AddUser(user: User): void {
		Users.push(user)
	}
	function RemoveEmptyLines(result: string[]): string[] {
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
	function processLogs(logs: string[], user: BackendUser): Log[] {
		let clearLogs = RemoveEmptyLines(logs)
		let result: Log[] = []
		clearLogs.forEach(log => {
			const serperators = [",", ""]
			const seperatedLog = log.split(new RegExp(serperators.join("|")))
			result.push(new Log(new Date(seperatedLog[0]), seperatedLog[1], seperatedLog[2], HttpPath.Build(seperatedLog[3]), Number(seperatedLog[4]), user))
		})
		return result
	}
	function LoadContent(): void {
		Content = fs.readdirSync(contentPath).filter((folderName: string) => {
			return folderName[0] != "."
		})
	}
	function LoadUsers(): void {
		const folders: string[] = fs.readdirSync(usersPath).filter((folderName: string) => {
			return folderName[0] != "."
		})
		folders.forEach(folder => {
			const userFolder = path.join(usersPath, folder)
			const meta = JSON.parse(fs.readFileSync(path.join(userFolder, "meta.json"), "utf-8"))
			const user = new User((meta.company) || (meta.Company), (meta.contact) || (meta.Contact))
			const contents: string[] = fs.readFileSync(path.join(userFolder, "content.csv"), "utf-8").split("\n")
			user.Name = folder
			user.Path = usersPath
			user.Url = ServerConfiguration.BaseUrl
			user.Contents = RemoveEmptyLines(contents)
			if (fs.existsSync(path.join(userFolder, "log.csv"))){
				const logs: string[] = fs.readFileSync(path.join(userFolder, "log.csv"), "utf-8").split("\n")
				user.Logs = processLogs(logs, user)
			}
			AddUser(user)
		})
	}
	export function OpenUser(name: string): User {
		const BreakException = {}
		let result: User
		try {
			Users.forEach(user => {
				if (user.Name == name) {
					result = user
					throw BreakException
				}
			})
		} catch (exception) {
		}
		return result
	}
	export function AllUsers(): string[] {
		let result: string[] = []
		Users.forEach(user => {
			result.push(user.Name)
		})
		return result
	}
	export function UpdateUser(userName: string, log: Log): void {
		const updatedUser = OpenUser(userName)
		updatedUser.Logs.push(log)
	}
}
