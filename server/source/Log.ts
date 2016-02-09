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
		constructor(data: Date, ipAddress: string, method: string, requestedPath: HttpPath, statusCode: number) {
			this.date = data;
			this.ipAddress = ipAddress;
			this.method = method;
			this.requestedPath = requestedPath;
			this.statusCode = statusCode;
			this.statusMessage = http.STATUS_CODES[statusCode];
		}
		public toString(): string {
			return this.date.toLocaleString() + "," + this.ipAddress + "," + this.method + "," + this.requestedPath.ToString() + "," + this.statusCode.toString() + "," + this.statusMessage;
		}
	}
}
