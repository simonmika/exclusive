import * as Wappli from "../Wappli"
import * as Data from "../Data"
import { ViewLocation } from "./ViewLocation"

export class ViewLog extends Wappli.ResourcePage<string[]> {
	private folder: any
	get Folder(): string { return this.folder }
	set Folder(folder: string) {
		this.folder = folder
		this.Invalidate()
	}
	private viewLocationPage: ViewLocation
	constructor(private backend: Data.Backend) {
		super("ViewLog", backend.Log)
		this.Title = "Log"
		this.AddHiddenChild(this.viewLocationPage = new ViewLocation())
	}
	private CreateListItem(date: string, address: string, count: number): Wappli.ListItem {
		return new Wappli.ListItem(date + " " + address, () => {
			if (address !== null && address !== undefined && address !== "") {
				this.viewLocationPage.Address = address
				this.viewLocationPage.Show()
			}
		}, count)
	}
	Setup() {
		this.Append(new Wappli.List(() => {
			const result = new Array<Wappli.ListItem>()
			if (!this.Value) {
				let lastDate: any = null
				let lastAddress: any = null
				let count = 1
				this.Value.forEach(line => {
					const entry = line.split(",")
					const date = entry[0].slice(0, 10)
					const address = entry[1]
					const folder = entry[3].split("/", 2)[1]
					if (folder === null || folder === undefined || folder == this.folder) {
						if (lastDate != date || lastAddress != address) {
							if (lastDate != null)
								result.push(this.CreateListItem(lastDate, lastAddress, count))
							lastDate = date
							lastAddress = address
							count = 1
						}
						count++
					}
				})
				if (lastDate != null)
					result.push(this.CreateListItem(lastDate, lastAddress, count))
			}
			return result
		}))
	}
}
