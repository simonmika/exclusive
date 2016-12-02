import { Widget } from "./Widget"

export class Checkbox extends Widget {
	private container: HTMLElement;
	private fieldset: HTMLFieldSetElement;
	private legend: HTMLLegendElement;
	private labels: HTMLLabelElement[] = new Array<HTMLLabelElement>();
	private inputs: HTMLInputElement[] = new Array<HTMLInputElement>();

	get Legend(): string { return this.legend.innerText; }
	set Legend(value: string) { this.legend.innerText = value; }
	get Values(): string[] {
		return this.inputs.filter(input => input.checked).map(input => input.value);
	}
	set Values(values: string[]) {
		this.inputs.forEach(input => {
			input.checked = values.indexOf(input.value) > -1;
			$(input).checkboxradio('refresh');
		});
	}

	constructor(identifier: string, legend: string, values: string[], private getValues: () => string[] = null, setValues: (values: string[]) => void = null) {
		super();
		this.container = document.createElement("div");
		this.container.classList.add("ui-field-contain");
		this.fieldset = document.createElement("fieldset");
		this.fieldset.setAttribute("data-role", "controlgroup");
		this.container.appendChild(this.fieldset);
		this.legend = document.createElement("legend");
		this.legend.appendChild(document.createTextNode(legend));
		this.fieldset.appendChild(this.legend);
		values.forEach(value => {
			var input: HTMLInputElement = document.createElement("input");
			input.name = value;
			input.id = value;
			input.value = value;
			input.type = "checkbox";
			if (setValues !== null)
				input.onchange = event => setValues(this.Values);
			else
				input.disabled = true;
			this.inputs.push(input);
			var label: HTMLLabelElement = document.createElement("label");
			label.appendChild(input);
			label.setAttribute("for", value);
			label.appendChild(document.createTextNode(value));
			this.fieldset.appendChild(label);
			this.labels.push(label);
		});
	}
	GetElement() {
		return this.container;
	}
	Update() {
		this.Values = (this.getValues !== null) ? this.getValues() : new Array<string>();
	}
}
