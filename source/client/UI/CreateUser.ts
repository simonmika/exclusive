import * as Wappli from "../Wappli"
import * as Data from "../Data"

export class CreateUser extends Wappli.CreateDialog<Data.User> {
	constructor(private backend: Data.Backend, private viewUser: Wappli.Page) {
		super("CreateUser", () => new Data.User(), "plus")
		this.Title = "Create User"
	}
	Setup() {
		this.backend.Content.Get(content => {
			this.Append(new Wappli.Field("company", "text", "Company", () => "", value => this.Data.company = value))
			this.Append(new Wappli.Field("contact", "text", "Contact", () => " <@>", value => this.Data.contact = value))
			this.Append(new Wappli.Checkbox("content", "Content", content, null, (values: string[]) => this.Data.folders = values))
			this.Append(new Wappli.Button("create", () => {
				this.backend.Users.Create(this.Data, succeeded => {
					if (succeeded)
						this.viewUser.Show()
					else
						alert("Failed to create user.")
				})
			}))
		})
	}
}
