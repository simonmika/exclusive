module Imint.Exclusive.Client.UI {
	export class ViewLocation extends Wappli.Page {
		private address: string;
		public set Address(address: string) { this.address = address; this.Invalidate(); }
		public get Address(): string { return this.address; }
		constructor() {
			super("ViewLocation");
			this.Title = "Location";
		}
		Setup() {
			this.Append(new Wappli.Browser(() => "https://db-ib.com/" + this.Address));
		}
	}
}
