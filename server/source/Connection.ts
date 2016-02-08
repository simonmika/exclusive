module Exclusive {
	export class Connection {
		private parsedUrl: any;
		private requestUrl: string;
		private requestPath: string;
		private request: any;
		get Request() { return this.request; }
		private response: any;
		get Response() { return this.response; }
		private authorisation: any;

		constructor(parsedUrl: any, request: any, response: any) {
			this.parsedUrl = parsedUrl;
			this.requestUrl = parsedUrl.href
			this.requestPath = parsedUrl.path;
			this.request = request;
			this.response = response;
			this.authorisation = request.headers["authorization"];
		}
		/**Sends a response to the client.
		 * Response.end() will be called automatically.
		 * @param message Type of string the message to be sent.
		 * @param statusCode Type of number status code for this response.
		 * @param headers Type of any object to be sent along with response as a header.
		 */
		public Write(message: string, statusCode: number, headers: any) {
			this.SetHeader(statusCode, headers);
			this.response.write(message);
			this.response.end();
		}
		/**Sends all users in Exclusive in a response to the client.
		 * Sets the header of Content-Type as application/json.
		 */
		public WriteAllUsers() {
			this.response.writeHead(200, "ok", { 'Content-Type': 'application/json' });
			var i = 0;
			var toPrint = "[\n";
			while (i < DataStore.Users.length) {
				if (i != 0)
					toPrint = "";
				for (var n = 0; i < DataStore.Users.length && n < 50; n++ , i++)
					toPrint += DataStore.Users[i].ToJSON() + ",\n";
				if (i != DataStore.Users.length)
					this.response.write(toPrint);
			}
			if (toPrint != "[\n")
				toPrint = toPrint.slice(0, -2);
			toPrint += "\n]";
			this.response.write(toPrint);
			this.response.end();
		}
		/**Sends a file to the client in the response.
		 * Response.end() will be called automatically.
		 * @param file Type of string name of the required file.
		 * @param log Type of boolean determining if this method is being called when making a log for a user to response accordingly.
		 * @param onCompleted The callback is passed one argument (statusCode), type of number that holds the proper status code for the response.
		 */
		public WriteFile(file: string, log?: boolean, onCompleted?: (statusCode: number) => void) {
			if (this.requestPath.substr(-1) == "/")
				file = path.join(file, 'index.html');
			fs.stat(file, (error: any, stats: any) => {
				if (stats.isDirectory()) {
					this.Write("Redirecting", 301, { 'Location': this.requestUrl + "/" });
					if (onCompleted)
						onCompleted(301);
				}
				else {
					fs.readFile(file, (error: any, data: any) => {
						if (data) {
							var contentType = Connection.ContentType(file);
							if (stats.size) {
								if ((this.request.headers['range']) && (this.request.headers.range.split('=')[0] == "bytes")) {
									var positions = this.request.headers.range.replace(/bytes=/, "").split("-");
									var start = parseInt(positions[0], 10);
									var total = stats.size;
									var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
									var chunksize = (end - start) + 1;
									this.response.writeHead(206, { 'Content-Range': 'bytes' + start + "-" + end + "/" + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': contentType });
									var stream = fs.createReadStream(file, { start: start, end: end })
										.on("open", () => {
											stream.pipe(this.response);
										}).on("error", (err: any) => {
											this.response.end(err);
										});
									if (onCompleted)
										onCompleted(206);
								}
								else {
									this.Write(data, 200, { 'Accept-Ranges': 'bytes', 'Content-Lenth': stats.size, 'Content-Type': contentType });
									if (onCompleted)
										onCompleted(200);
								}
							}
							else {
								this.Write(data, 200, { 'Content-Type': contentType });
								if (onCompleted)
									onCompleted(200);
							}
						}
						else {
							if (log) {
								this.Write("Moved Permanently", 301, { 'Content-Type': 'text/html' });
								if (onCompleted)
									onCompleted(301);
							}
							else {
								this.Write("Not Found", 404, { 'Content-Type': 'text/html' });
								if (onCompleted)
									onCompleted(404);
							}
						}
					});
				}
			});
		}
		/**Receives data from a client in this connection and creates a type of User object according to the received data.
		 * @param onCompleted the callback is passed one argument (result) type of User holds the created object of User.
		*/
		public Receive(onCompleted: (result: User) => void) {
			var result: User = null;
			this.ReceivingData((fullbody) => {
				if (fullbody) {
					var contents: string[] = [];
					var jsonUser = JSON.parse(fullbody);
					if ((jsonUser.company || jsonUser.Company) && (jsonUser.contact || jsonUser.Contact) && (jsonUser.crm || jsonUser.Crm)) {
						var theCompany: any;
						var theContact: any;
						var theCrm: any;
						(jsonUser.company) ? theCompany = jsonUser.company : theCompany = jsonUser.Company;
						(jsonUser.contact) ? theContact = jsonUser.contact : theContact = jsonUser.Contact;
						(jsonUser.crm) ? theCrm = jsonUser.crm : theCrm = jsonUser.Crm;
						result = new User(theCompany, theContact, theCrm);
						if ((jsonUser.folders) || (jsonUser.Folders)) {
							var theFolders: any;
							(jsonUser.folders) ? theFolders = jsonUser.folders : theFolders = jsonUser.Folders;
							for (var i = 0; i < theFolders.length; i++)
								contents.push(theFolders[i]);
						}
						result.Contents = contents;
						onCompleted(result);
					}
					else
						onCompleted(null);
				}
				else
					onCompleted(null);
			});
		}
		/**Receives the data from the client.
		 * @param callback the callback is passed one argument (result) type of string which holds the fullbody of the received data.
		 */
		private ReceivingData(callback: (result: string) => void) {
			var fullBody: string = "";
			this.request.on('data', (chunk: string) => {
				fullBody += chunk;
			});
			this.request.on('end', () => {
				callback(fullBody);
			});
		}
		/**Authenticates the client credentials in this connection.
		 * Sends an immediate response in case of a failure authentication.
		 * @param onCompleted the callback is passed one argument (result) type of boolean which holds the result of the authentication.
		 */
		public Authenticate(onCompleted: (result: boolean) => void) {
			if (!this.authorisation)
				this.Write("Authorisation Required", 401, { 'WWW-Authenticate': 'Basic realm=\"imint.se\"' });
			else {
				var basic: any[] = this.IsBasicAuthorisation();
				if (basic[0]) {
					var credential = this.ParseBasicAuthorisation(basic[1]);
					this.ValidateCredential(credential[0], credential[1], (result: boolean) => {
						if (!result)
							this.Write("Unauthorised", 401, { 'WWW-Authenticate': 'Basic realm=\"imint.se\"' });
						onCompleted(result);
					});
				}
				else this.Write("Basic Authorisation Required", 401, { 'WWW-Authenticate': 'Basic realm=\"imint.se\"' });
			}
		}
		/**Checks if the type of the sent authorisation is basic
		 * Returns an array of any. If the authorisation is basic a credentials will be return, otherwise it returns null.
		*/
		private IsBasicAuthorisation(): any[] {
			var authorisation = this.authorisation.split(' ');
			return (authorisation[0] == "Basic") ? [true, authorisation[1]] : [false, null];
		}
		/**Parses a basic authorisation.
		 * Returns an array of strings contains the username and the password.
		 * @param basicAuthorisation type of any the authorisation to be parsed.
		 */
		private ParseBasicAuthorisation(basicAuthorisation: any): string[] {
			return (new Buffer(basicAuthorisation, 'base64')).toString().split(':');
		}
		/**Validates credentials at https://imint.highrisehq.com.
		 * @param userName type of string username.
		 * @param password type of string password.
		 * @param callback the callback is passed on argument (result) type of boolean whicj holds the result of the validation.
		 */
		private ValidateCredential(userName: string, password: string, callback: (result: boolean) => void) {
			var https = require('https');
			https.get({ hostname: 'imint.highrisehq.com', path: '/me.xml', auth: userName + ':' + password }, (response: any) => {
				if (response.statusCode == 200)
					callback(true);
				else
					callback(false);
			});
		}
		/**Determines the proper content type for a file.
		 * Returns type of string content type.
		 * @param file Type of string name of the file. 
		 */
		private static ContentType(file: string): string {
			var contentTypes: any  = {".html": "text/html; charset=utf8",
				".txt": "text/plain",
				".js": "application/javascript",
				".gif": "image/gif",
				".json": "application/json; charset=UTF-8",
				".css": "text/css; charset=UTF-8",
				".csv": "text/csv; charset=UTF-8",
				".mp4": "video/mp4",
				".webm": "video/webm",
				".png": "image/png",
				".jpg": "image/jpeg",
				".jpeg": "image/jpeg",
				".svg": "image/svg+xml",
				".pdf": "application/pdf",
				".xml": "application/xml",
				".zip": "application/zip"};
			return (path.extname(file) in contentTypes) ? contentTypes[path.extname(file)] : null;
		}
		/**Sets the the status code, the status message according to the status code and the headers of this response.
		 * @param statusCode Type of number status code for this response.
		 * @param Type of any object to be sent along with response as a header.
		 */
		private SetHeader(statusCode: number, headers: any) {
			this.response.writeHead(statusCode, http.STATUS_CODES[statusCode], headers);
		}
	}
}
