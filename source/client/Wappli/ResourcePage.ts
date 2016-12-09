import { Resource } from "./Resource"
import { Page } from "./Page"

export class ResourcePage<T> extends Page {
	private resource: Resource<T>
	get Resource(): Resource<T> { return this.resource }
	private value: T
	get Value(): T { return this.value }
	constructor(name: string, resource: Resource<T>, icon: string = null, dialog: boolean = false) {
		super(name, icon, dialog)
		this.resource = resource
		this.resource.OnInvalidate(() => this.Invalidate())
	}
	Update() {
		this.Resource.Get((value: T) => {
			this.value = value
			super.Update()
		})
	}
}
