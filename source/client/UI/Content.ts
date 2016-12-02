import * as Wappli from "../Wappli"
import * as Data from "../Data"
import { ViewContent } from "./ViewContent"

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
			})), false, "content", true));
	}
}
