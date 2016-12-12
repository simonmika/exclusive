import * as common from "../common"

export interface IConfiguration extends common.IConfiguration {
	listen?: string
	storage?: string
	authenticate?(user: { name: string, password: string }, callback: (result: boolean) => void): void
}
