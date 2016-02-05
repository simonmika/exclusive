/// <reference path="ViewLog.ts"/>
/// <reference path="EditUser.ts"/>
/// <reference path="../wappli/Group.ts"/>

module Imint.Exclusive.Client.UI {
	export class User extends Wappli.ResourcePage<Data.User> {
		private viewLogPage: ViewLog;
		constructor(private backend: Data.Backend) {
			super("User", backend.Users.Current);
			this.Title = "User";
			this.AddHeaderChild(new EditUser(backend));
			this.AddHiddenChild(this.viewLogPage = new ViewLog(backend));
		}
		Setup() {
			this.Append(new Wappli.Field("name", "text", "Name", () => this.Value !== undefined ? this.Value.name : ""));
			this.Append(new Wappli.Field("company", "text", "Company", () => this.Value !== undefined ? this.Value.company : ""));
			this.Append(new Wappli.Field("contact", "text", "Contact", () => this.Value !== undefined ? this.Value.contact : ""));
			this.Append(new Wappli.Group("folder", "Folders", new Array<Wappli.Widget>(new Wappli.List(() => {
				return (this.Value !== undefined) ?
					this.Value.folders.sort().map(folder => new Wappli.ListItem(folder, () => {
						this.viewLogPage.Folder = folder;
						this.viewLogPage.Show();
					})) : null;
			}, true))));
		}
	}
}
