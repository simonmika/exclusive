import { Widget } from "./Widget"
import { ListItem } from "./ListItem"

export class List extends Widget {
	private list: HTMLUListElement
	constructor(private getValues: () => ListItem[], mixed: boolean = false, filter: string = null, autoDividers: boolean = false) {
		super()
		this.list = document.createElement("ul")
		this.list.setAttribute("data-role", "listview")
		if (autoDividers)
			this.list.setAttribute("data-autodividers", "true")
		if (filter !== null) {
			this.list.setAttribute("data-filter", "true")
			this.list.setAttribute("data-filter-placeholder", "Search for " + filter + "..")
		}
		if (mixed)
			this.list.setAttribute("data-inset", "true")
	}
	GetElement() {
		return this.list
	}
	Update() {
		while (this.list.firstChild)
			this.list.removeChild(this.list.firstChild)
		const values = this.getValues()
		values.forEach(value => this.list.appendChild(value.GetElement()))
		$(this.list).listview("refresh")
	}
}
