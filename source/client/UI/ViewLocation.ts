import * as Wappli from "../Wappli"

export class ViewLocation extends Wappli.Page {
	private address: string
	// tslint:disable-next-line:semicolon
	public set Address(address: string) { this.address = address; this.Invalidate() }
	public get Address(): string { return this.address }
	constructor() {
		super("ViewLocation")
		this.Title = "Location"
	}
	Setup() {
		this.Append(new Wappli.Browser(() => "https://db-ip.com/" + this.Address))
	}
}
