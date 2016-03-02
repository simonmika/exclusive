/// <reference path="../data/User.ts"/>
/// <reference path="../data/Backend.ts"/>
/// <reference path="../wappli/CreateDialog.ts"/>
/// <reference path="../wappli/Field.ts"/>
/// <reference path="../wappli/Checkbox.ts"/>
/// <reference path="../wappli/Button.ts"/>
module Imint.Exclusive.Client.UI {
	export class CreateUser extends Wappli.CreateDialog<Data.User> {
		constructor(private backend: Data.Backend, private viewUser: Wappli.Page) {
			super("CreateUser", () => new Data.User(), "plus");
			this.Title = "Create User";
		}
		Setup() {
			this.backend.Content.Get(content => {
				this.Append(new Wappli.Field("company", "text", "Company", () => "", value => this.Data.company = value));
				this.Append(new Wappli.Field("contact", "text", "Contact", () => " <@>", value => this.Data.contact = value));
                this.Append(new Wappli.Checkbox("content", "Content", content, null, (values: string[]) => this.Data.folders = values));
				this.Append(new Wappli.Button("create", () => {
					this.backend.Users.Create(this.Data, succeeded => {
						if (succeeded)
							this.viewUser.Show();
						else
							alert("Failed to create user.");
					});
                }));
			});
		}
	}
}
