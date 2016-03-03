/// <reference path="../lib/jquery.d.ts"/>
/// <reference path="../lib/jquerymobile.d.ts"/>
/// <reference path="Widget.ts"/>
module Wappli{
	export class Page {
        private invalidated = true;
        private page: HTMLElement;
        private header: HTMLElement;
        private backButton: HTMLAnchorElement;
        private heading: HTMLHeadingElement;
        private title: Text;
        private content: HTMLElement;
        private footer: HTMLElement;
        private hasParent = false;
        private hasChildren = false;
        private children: Page[] = new Array<Page>();
        private headerElements: HTMLElement[] = new Array<HTMLElement>();
        private widgets: Widget[] = new Array<Widget>();
        get Name(): string { return this.name; }
        get Title(): string { return this.title.data; }
        set Title(value: string) { this.title.data = value; }
        private button: string;
        get Button(): string { return this.button !== undefined ? this.button : this.Title; }
        set Button(value: string) { this.button = value; }
        constructor(private name: string, private icon: string = null, private dialog: boolean = false) {
            this.page = document.createElement("section");
            this.page.setAttribute("data-role", "page");
            this.page.style.minHeight = "100%";
            this.page.id = "page" + this.name;
            // Header
            this.header = document.createElement("header");
            this.header.setAttribute("data-role", "header");
            if (!this.dialog)
                this.header.setAttribute("data-position", "fixed");
            // Back Button
            if (!this.dialog) {
                this.backButton = document.createElement("a");
				this.backButton.classList.add("ui-btn", "ui-shadow", "ui-corner-all", "ui-btn-left");
                this.backButton.setAttribute("data-rel", "back");                
                this.backButton.appendChild(document.createTextNode("back"));
            } else
                this.backButton = null;
            // Title
            this.heading = document.createElement("h1");
            this.heading.appendChild(this.title = document.createTextNode(this.name));
            // Content
            this.content = document.createElement("div");
			this.content.classList.add("ui-content");
            this.content.setAttribute("role", "main");
            this.content.style.minHeight = "100%";
            // Footer
            this.footer = document.createElement("footer");
            this.footer.setAttribute("data-role", "footer");
            this.footer.classList.add("ui-btn");
            if (!this.dialog)
                this.footer.setAttribute("data-position", "fixed");
        }
        Initialize(): boolean {
            if (this.hasParent && this.backButton !== null)
                this.header.appendChild(this.backButton);
            this.header.appendChild(this.heading);
            this.headerElements.forEach(element => this.header.appendChild(element));
            this.page.appendChild(this.header);
            this.page.appendChild(this.content);
            if (this.footer.hasChildNodes())
                this.page.appendChild(this.footer);
            document.body.appendChild(this.page);
            this.children.forEach(child => child.Initialize());
            var me = this;
            $(this.page).bind("pageshow", (event, ui) => {
				if (me.invalidated)
					me.Update();
            });
            this.Setup();
            return true;
        }
        Setup(): void {
        }
        Invalidate(): void {
			this.invalidated = true;
        }
        Update(): void {
            if (this.widgets !== undefined)
				this.widgets.forEach(f => f.Update());
			this.invalidated = false;
        }
        AddHiddenChild(child: Page): void {
            child.hasParent = true;
            this.hasChildren = true;
            this.children.push(child);
        }
        private CreateChildLink(child: Page): HTMLAnchorElement {
            this.AddHiddenChild(child);
            var result: HTMLAnchorElement = document.createElement("a");
			result.classList.add("ui-btn", "ui-shadow", "ui-corner-all");
            result.setAttribute("data-transition", child.dialog ? "pop" : "slide");
            if (child.dialog)
                result.setAttribute("data-rel", "dialog");
            result.href = "#page" + child.name;
            if (child.icon !== null)
				result.classList.add("ui-btn-icon-notext", "ui-icon-" + child.icon);
            else
                result.appendChild(document.createTextNode(child.Button));
            return result
        }
        AddChild(child: Page): void {
            this.footer.appendChild(this.CreateChildLink(child));
        }
        AddHeaderChild(child: Page): void {
            this.headerElements.push(this.CreateChildLink(child));
        }
        Append(widget: Widget): Widget {
			this.widgets.push(widget);
			this.content.appendChild(widget.GetElement());
			return widget;
        }
        Show(): void {
            $.mobile.changePage("#page" + this.name, "slide");
        }
    }
}
