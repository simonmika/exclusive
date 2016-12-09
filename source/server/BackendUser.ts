export class BackendUser {
	protected company: string
	get Company() { return this.company }
	protected contact: string
	get Contact() { return this.contact }
	constructor(company: string, contact: string){
		this.company = company
		this.contact = contact
	}
	protected ToJSON(): string {
		return "{\n\"company\": \"" + this.company + "\",\n\"contact\": \"" + this.contact + "\"\n}"
	}
}
