module Wappli{
	export class ListItem {
		constructor(public label: string, public onActivate: () => void = null, public count: number = undefined) {
		}
		public GetElement(): HTMLLIElement {
			var result: HTMLLIElement = document.createElement("li");
			if (this.onActivate !== null) {
				var link: HTMLAnchorElement = document.createElement("a");
                link.href = "#";
				link.appendChild(document.createTextNode(this.label));
				link.onclick = event => this.onActivate();
				result.appendChild(link);
			}
			else {
				result.appendChild(document.createTextNode(this.label));
				result.setAttribute("data-role", "divider");
			}
			if (this.count !== undefined) {
				var span: HTMLSpanElement = document.createElement("span");
				span.classList.add("ui-li-count");
				span.appendChild(document.createTextNode(this.count.toString()));
				result.appendChild(span);
			}
            return result;
		}
	}
}
