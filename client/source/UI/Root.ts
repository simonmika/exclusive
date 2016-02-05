/// <reference path="Content.ts"/>
/// <reference path="Settings.ts"/>
/// <reference path="Users.ts"/>
/// <reference path="../wappli/ResourcePage.ts"/>
module Imint.Exclusive.Client.UI {
	export class Root extends Wappli.ResourcePage<Data.IRoot> {
		private pages: Wappli.Page[] = new Array<Wappli.Page>();
		constructor(private backend: Data.Backend) {
			super("Root", backend.Root);
			this.Title = "Exclusive";
			var contentPage = new Content(this.backend);
			this.AddHiddenChild(contentPage);
			var usersPage = new Users(this.backend);
			this.AddHiddenChild(usersPage);
			this.pages.push(contentPage, usersPage);
			this.AddHeaderChild(new Settings(this.backend.Service));
		}
		Setup() {
			this.Append(new Wappli.List(() => this.pages.map(page => new Wappli.ListItem(page.Button, () => page.Show()))));
		}
	}
}
