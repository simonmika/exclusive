/// <reference path="User.ts"/>
/// <reference path="CreateUser.ts"/>

module Imint.Exclusive.Client.UI {
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
						return left.company < right.company ? -1 :
							left.company > right.company ? 1 :
								left.name < right.name ? -1 :
									left.name > right.name ? 1 : 0;
					}).map(user => new Wappli.ListItem(user.company + " (" + user.name + ")", () => {
						this.backend.Users.Current.Set(user);
						this.childPage.Show();
					})) : null;
			}));
		}
	}
}
