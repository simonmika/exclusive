export class ListItem {
	constructor(public label: string, public onActivate: () => void = null, public count: number = undefined) {
	}
	public GetElement(): HTMLLIElement {
		var result: HTMLLIElement = document.createElement("li");
		var link: HTMLAnchorElement = undefined;
		if (this.onActivate !== null) {
			link = document.createElement("a");
			link.href = "#";
			link.appendChild(document.createTextNode(this.label));
			link.onclick = event => this.onActivate();
			result.appendChild(link);
		}
		else {
			result.appendChild(document.createTextNode(this.label));
			result.setAttribute("data-role", "list-divider");
		}
		if (this.count !== undefined) {
			var span: HTMLSpanElement = document.createElement("span");
			span.classList.add("ui-li-count");
			span.appendChild(document.createTextNode(this.count.toString()));
			if (link !== undefined)
				link.appendChild(span);
			else 
				result.appendChild(span);
		}
		return result;
	}
}
