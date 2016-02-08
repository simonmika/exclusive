module Exclusive {
	export class BackendUser {
		protected company: string;
		get Company() { return this.company; }
		protected contact: string;
		get Contact() { return this.contact; }
		protected crm: string;
		get Crm() { return this.crm; }

		constructor(company: string, contact: string, crm: string){
			this.company = company;
			this.contact = contact;
			this.crm = crm;
		}
		/**Converts this object of Backend_User to JSON.
		 * Returns a string implements JSON standard for this backend.
		 */
		public ToJSON(): string {
			return "{\n\"company\": \"" + this.company + "\",\n\"contact\": \"" + this.contact + "\",\n\"crm\": \"" + this.crm + "\"\n}";
		}
	}
}
