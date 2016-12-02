import { Widget } from "./Widget"

export class Button extends Widget {
	private button: HTMLAnchorElement;
	get Label(): string { return this.button.innerText; }
	set Label(value: string) { this.button.innerText = value; }
	constructor(label: string, private onActivate: () => void) {
		super();
		this.button = document.createElement("a");
		this.button.classList.add("ui-btn", "ui-shadow", "ui-corner-all");
		this.button.onclick = event => this.onActivate();
		this.button.appendChild(document.createTextNode(label));
	}
	GetElement() {
		return this.button;
	}
	Update() {
	}
}
