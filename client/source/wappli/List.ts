/// <reference path="Widget.ts"/>
/// <reference path="ListItem.ts"/>

module Wappli{
	export class List extends Widget {
		private list: HTMLUListElement;
        constructor(private getValues: () => ListItem[], mixed: boolean = false) {
            super();
            this.list = document.createElement("ul");
            this.list.setAttribute("data-role", "listview");
            if (mixed)
                this.list.setAttribute("data-inset", "true");
        }
		GetElement() {
			return this.list;
		}
		Update() {
			while (this.list.firstChild)
				this.list.removeChild(this.list.firstChild);
			var values = this.getValues();
			values.forEach(value => this.list.appendChild(value.GetElement()));
			$(this.list).listview("refresh");
		}
	}
}
