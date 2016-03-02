/// <reference path="../wappli/ResourcePage.ts"/>
/// <reference path="../wappli/Field.ts"/>
/// <reference path="../wappli/Checkbox.ts"/>
/// <reference path="../wappli/Button.ts"/>
/// <reference path="../data/User.ts"/>
/// <reference path="../data/Backend.ts"/>

module Imint.Exclusive.Client.UI {
	export class EditUser extends Wappli.ResourcePage<Data.User> {
		constructor(private backend: Data.Backend) {
			super("EditUser", backend.Users.Current);
			this.Title = "Edit User";
			this.Button = "edit";
		}
		Setup() {
			this.backend.Content.Get(content => {
				this.Append(new Wappli.Field("name", "text", "Name", () => this.Value !== undefined ? this.Value.name : ""));
				this.Append(new Wappli.Field("company", "text", "Company", () => this.Value !== undefined ? this.Value.company : "", value => this.Value.company = value));
				this.Append(new Wappli.Field("contact", "text", "Contact", () => this.Value !== undefined ? this.Value.contact : "", value => this.Value.contact = value));
                this.Append(new Wappli.Checkbox("content", "Content", content, () => this.Value !== undefined ? this.Value.folders : new Array<string>(), (values: string[]) => this.Value.folders = values));
				this.Append(new Wappli.Button("save", () => {
					this.Resource.Save(succeeded => {
						if (succeeded)
							history.back();
						else
							alert("Failed to save user.");
					});
                }));
			});
		}
	}
}
