/// <reference path="Page.ts"/>

module Wappli {
	export class CreateDialog<T> extends Page {
		private data: T;
		get Data(): T { return this.data; }
		constructor(name: string, private createObject: () => T, icon: string) {
			super(name, icon, true);
		}
		Update() {
			this.Load(this.data = this.createObject());
			super.Update();
		}
		Load(value: T) {
		}
    }
}
