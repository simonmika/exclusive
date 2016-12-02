import * as Wappli from "../Wappli"
import * as Data from "../Data"
import { User } from "./User"
import { CreateUser } from "./CreateUser"

export class Users extends Wappli.ResourcePage<Data.User[]> {
	private childPage: User;
	constructor(private backend: Data.Backend) {
		super("Users", backend.Users);
		this.Title = "Users";
		this.AddHiddenChild(this.childPage = new User(backend));
		this.AddHeaderChild(new CreateUser(backend, this.childPage));
	}
	Setup() {
		this.Append(new Wappli.List(() => {
			console.log("Users Page reload");
			return (this.Value !== undefined) ?
				this.Value.sort((left, right) => {
					var leftCompany = left.company.toUpperCase();
					var leftName = left.name.toUpperCase();
					var rightCompany = right.company.toUpperCase();
					var rightName = right.name.toUpperCase();
					return leftCompany < rightCompany ? -1 :
						leftCompany > rightCompany ? 1 :
							leftName < rightName ? -1 :
								leftName > rightName ? 1 : 0;
				}).map(user => new Wappli.ListItem(user.company + " (" + user.name + ")", () => {
					this.backend.Users.Current.Set(user);
					this.childPage.Show();
				})) : null;
		}, false, "users", true));
	}
}
