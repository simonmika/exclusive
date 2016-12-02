/// <reference path="ViewLocation.ts"/>

module Imint.Exclusive.Client.UI {
	export class ViewLog extends Wappli.ResourcePage<string[]> {
		private folder: any;
		public get Folder(): string { return this.folder; }
		public set Folder(folder: string) {
			this.folder = folder;
			this.Invalidate();
		}
		private viewLocationPage: ViewLocation;
		constructor(private backend: Data.Backend) {
			super("ViewLog", backend.Log);
			this.Title = "Log";
			this.AddHiddenChild(this.viewLocationPage = new ViewLocation());
		}
		private CreateListItem(date: string, address: string, count: number): Wappli.ListItem {
            return new Wappli.ListItem(date + " " + address, () => {
                if (address !== null && address !== undefined && address !== "") {
                    this.viewLocationPage.Address = address;
                    this.viewLocationPage.Show();
                }
            }, count);
		}
		Setup() {
			this.Append(new Wappli.List(() => {
				var result = new Array<Wappli.ListItem>();
				if (this.Value !== null) {
					var lastDate: any = null;
					var lastAddress: any = null;
					var count = 1;
					this.Value.forEach(line => {
						var entry = line.split(",");
						var date = entry[0].slice(0, 10);
						var address = entry[1];
						var folder = entry[3].split("/", 2)[1];
						if (folder === null || folder === undefined || folder == this.folder) {
							if (lastDate != date || lastAddress != address) {
								if (lastDate != null)
									result.push(this.CreateListItem(lastDate, lastAddress, count));
								lastDate = date;
								lastAddress = address;
								count = 1;
							}
							count++;
						}
					});
                    if (lastDate != null)
						result.push(this.CreateListItem(lastDate, lastAddress, count));
				}
				return result;
			}));
		}
	}
}
