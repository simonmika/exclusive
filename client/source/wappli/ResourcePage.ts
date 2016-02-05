/// <reference path="Resource.ts"/>
/// <reference path="Page.ts"/>

module Wappli{
	export class ResourcePage<T> extends Page {
		private resource: Wappli.Resource<T>;
		get Resource(): Wappli.Resource<T> { return this.resource; }
		private value: T;
		get Value(): T { return this.value; }
		constructor(name: string, resource: Wappli.Resource<T>, icon: string = null, dialog: boolean = false) {
			super(name, icon, dialog);
			this.resource = resource;
			this.resource.OnInvalidate(() => this.Invalidate());
		}
		Update() {
			this.Resource.Get((value: T) => {
				this.value = value;
				super.Update();
			});
		}
    }
}
