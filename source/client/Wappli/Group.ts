import { Widget } from "./Widget"

export class Group extends Widget {
	private container: HTMLElement;
	private fieldset: HTMLFieldSetElement;
	private legend: HTMLLegendElement;

	get Legend(): string { return this.legend.innerText; }
	set Legend(value: string) { this.legend.innerText = value; }

	constructor(identifier: string, legend: string, private widgets: Widget[]) {
		super();
		this.container = document.createElement("div");
		this.container.classList.add("ui-field-contain");
		this.fieldset = document.createElement("fieldset");
		this.fieldset.setAttribute("data-role", "controlgroup");
		this.container.appendChild(this.fieldset);
		this.legend = document.createElement("legend");
		this.legend.appendChild(document.createTextNode(legend));
		this.fieldset.appendChild(this.legend);
		this.widgets = widgets;
		this.widgets.forEach(widget => this.fieldset.appendChild(widget.GetElement()));
	}
	GetElement() {
		return this.container;
	}
	Update() {
		this.widgets.forEach(widget => widget.Update());
	}
}
