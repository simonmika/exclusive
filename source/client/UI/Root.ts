import * as Wappli from "../Wappli"
import * as Data from "../Data"
import { Content } from "./Content"
import { Settings } from "./Settings"
import { Users } from "./Users"

export class Root extends Wappli.ResourcePage<Data.IRoot> {
	private pages: Wappli.Page[] = new Array<Wappli.Page>()
	constructor(private backend: Data.Backend) {
		super("Root", backend.Root)
		this.Title = "Exclusive"
		const contentPage = new Content(this.backend)
		this.AddHiddenChild(contentPage)
		const usersPage = new Users(this.backend)
		this.AddHiddenChild(usersPage)
		this.pages.push(contentPage, usersPage)
		this.AddHeaderChild(new Settings(this.backend.Service))
		const thisRoot = this
		backend.GlobalLog.FetchUrl(url => {
			thisRoot.AddHeaderButton("Download log", url, false, "external")
		})
	}
	Setup() {
		this.Append(new Wappli.List(() => this.pages.map(page => new Wappli.ListItem(page.Button, () => page.Show()))))
	}
}
