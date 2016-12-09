import { Widget } from "./Widget"

export class Browser extends Widget {
	private container: HTMLIFrameElement
	constructor(private getValue: () => string = null) {
		super()
		this.container = document.createElement("iframe")
		this.container.style.border = "0"
		this.container.style.width = "100%"
		this.container.style.height = "1000px"
		this.container.src = "JavaScript:''"
	}
	GetElement() {
		return this.container
	}
	Update() {
		if (this.getValue !== null) {
			let url = this.getValue()
			if (!url || url === "")
				url = "JavaScript:''"
			this.container.setAttribute("src", url)
		}
	}
}
