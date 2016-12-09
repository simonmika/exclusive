import { Service } from "./Service"
export class Resource<T extends { url?: string }> {
	private value: T
	private valid: boolean = false
	private onInvalidate: { (resource: Resource<T>): void }[] = new Array<{ (resource: Resource<T>): void }>()
	private url: string = null
	set Url(value: string) {
		if (this.url !== value) {
			this.url = value
			this.Invalidate()
		}
	}
	get Service(): Service {
		return this.service
	}
	constructor(private service: Service, private fetchUrl: (action: (url: string) => void) => void = null, private onSaved: (value: T) => void = null) {
	}
	FetchUrl(action: (url: string) => void): boolean {
		let result: boolean
		if (result = this.url !== null)
			action(this.url)
		else if (result = this.fetchUrl !== null)
			this.fetchUrl(url => action(this.url = url))
		return result
	}
	Get(action: (value: T) => void = null): boolean {
		let result: boolean
		if (result = this.valid) {
			if (action !== null)
				action(this.value)
		} else {
			result = this.FetchUrl(url => {
				this.service.Get<T>(this.url, (value: T) => {
					this.Set(value)
					if (action !== null)
						action(value)
				})
			})
		}
		return result
	}
	Set(value: T) {
		if (this.value !== value) {
			this.Invalidate()
			this.value = value
			this.url = value && value.url ? value.url : null
			this.valid = true
		}
	}
	Update(update: (value: T) => T) {
		this.Get(value => this.Set(update(value)))
	}
	Save(done: (succeeded: boolean) => void = null) {
		this.FetchUrl(url => {
			this.Service.Put<T>(url, this.value, (value: T) => {
				if (value !== null) {
					if (this.onSaved !== null)
						this.onSaved(value)
					this.Set(value)
					if (done !== null)
						done(true)
				} else if (done !== null)
					done(false)
			})
		})
	}
	OnInvalidate(action: { (resource: Resource<T>): void }) {
		this.onInvalidate.push(action)
	}
	Invalidate() {
		if (this.valid) {
			this.valid = false
			this.onInvalidate.forEach(action => action(this))
		}
	}
}
