/// <reference path="ViewContent.ts"/>
/// <reference path="../wappli/ListItem.ts"/>
/// <reference path="../wappli/List.ts"/>

module Imint.Exclusive.Client.UI {
	export class Content extends Wappli.ResourcePage<string[]> {
		private viewContentPage: ViewContent;
		constructor(backend: Data.Backend) {
			super("Content", backend.Content);
			this.Title = "Content";
			this.AddHiddenChild(this.viewContentPage = new ViewContent(backend.Service));
		}
		Setup() {
			this.Append(new Wappli.List(() => this.Value.map(folder =>
				new Wappli.ListItem(folder, () => {
                    this.viewContentPage.Folder = folder;
                    this.viewContentPage.Show();
				}))));
		}
	}
}
