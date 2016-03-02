module Exclusive {
	export class BackendUser {
		protected company: string;
		protected contact: string;
		constructor(company: string, contact: string){
			this.company = company;
			this.contact = contact;
		}
		protected ToJSON(): string {
			return "{\n\"company\": \"" + this.company + "\",\n\"contact\": \"" + this.contact + "\"\n}";
		}
	}
}
