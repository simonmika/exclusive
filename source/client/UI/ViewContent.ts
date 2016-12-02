import * as Wappli from "../Wappli"

export class ViewContent extends Wappli.Page {
	private folder: string;
	public set Folder(folder: string) { this.folder = folder; this.Invalidate(); }
	public get Folder(): string { return this.folder; }
	constructor(private service: Wappli.Service) {
		super("ViewContent");
		this.Title = "Content";
	}
	Setup() {
		this.Append(new Wappli.Browser(() => this.service.Server + "/content/" + this.Folder));
	}
}
