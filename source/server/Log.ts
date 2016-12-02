module Exclusive {
	export class Log {
		private date: Date;
		get Date() { return this.date; }
		private ipAddress: string;
		get IpAddress() { return this.ipAddress; }
		private method: string;
		get Method() { return this.method; }
		private requestedPath: HttpPath;
		get RequestedPath() { return this.requestedPath; }
		private statusCode: number;
		get StatusCode() { return this.statusCode; }
		private statusMessage: string;
		get StatusMessage() { return this.statusMessage; }
		private user: BackendUser;
		get User() { return this.user; }
		constructor(data: Date, ipAddress: string, method: string, requestedPath: HttpPath, statusCode: number, user: BackendUser) {
			this.date = data;
			this.ipAddress = ipAddress;
			this.method = method;
			this.requestedPath = requestedPath;
			this.statusCode = statusCode;
			this.statusMessage = http.STATUS_CODES[statusCode];
			this.user = user;
		}
		public toString(): string {
			return this.date.toLocaleString() + "," + this.ipAddress + "," + this.method + "," + this.requestedPath.ToString() + "," + this.statusCode.toString() + "," + this.statusMessage;
		}
		public toStringExtended(): string {
			return this.date.toLocaleString() + "," + this.ipAddress + "," + this.method + "," + this.requestedPath.ToString() + "," + this.statusCode.toString() + "," + this.statusMessage + "," + this.requestedPath.Tail.Head + "," + this.user.Company + "," + this.user.Contact;
		}
	}
}
