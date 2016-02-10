module Exclusive {
	export class BackendUser {
		protected company: string;
		protected contact: string;
		protected crm: string;
		constructor(company: string, contact: string, crm: string){
			this.company = company;
			this.contact = contact;
			this.crm = crm;
		}
		protected ToJSON(): string {
			return "{\n\"company\": \"" + this.company + "\",\n\"contact\": \"" + this.contact + "\",\n\"crm\": \"" + this.crm + "\"\n}";
		}
	}
}
