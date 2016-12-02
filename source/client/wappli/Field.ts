/// <reference path="Widget.ts"/>
module Wappli {
	export class Field extends Widget {
		private label: HTMLLabelElement;
		private input: HTMLInputElement;

		get Label(): string { return this.label.innerText; }
		set Label(value: string) { this.label.innerText = value; }
		get Value(): string { return this.input.value; }
		set Value(value: string) {
			if (value === undefined || value === null)
				value = "";
			this.input.value = value;
		}

		private container: HTMLElement;

		constructor(name: string, type: string, label: string, private getValue: () => string = null, setValue: (value: string) => void = null) {
			super();
			this.label = document.createElement("label");
			this.label.setAttribute("for", name);
			this.label.appendChild(document.createTextNode(label));
			this.input = document.createElement("input");
			this.input.name = name;
			this.input.id = name;
			this.input.type = type;
			this.Update();
			if (setValue !== null)
				this.input.onchange = event => setValue(this.Value);
			else
				this.input.disabled = true;
			this.container = document.createElement("div");
			this.container.classList.add("ui-field-contain");
			this.container.appendChild(this.label);
			this.container.appendChild(this.input);
		}
		GetElement() {
			return this.container;
		}
		Update() {
			this.Value = this.getValue !== null ? this.getValue() : "";
		}
	}
}
