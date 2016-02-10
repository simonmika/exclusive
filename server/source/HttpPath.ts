module Exclusive {
	export class HttpPath {
		private head: string;
		get Head() { return this.head; }
		set Head(value: string) { this.head = value; }
		private tail: HttpPath;
		get Tail() { return this.tail; }
		set Tail(value: HttpPath) { this.tail = value; }
		constructor();
		constructor(head: string, tail: HttpPath);
		constructor(head?: string, tail?: HttpPath) {
			(head) ? this.head = head : this.head = "";
			(tail) ? this.tail = tail : this.tail = null;

		}
		public static Build(url: string): HttpPath {
			var result = new HttpPath();
			var i: number;

			(url[0] == "/") ? i = 1 : i = 0;
			for (i; i < url.length && url[i] != "/"; i++)
				result.head += url[i];

			if (i < url.length) {
				var urlTail = "";
				for (i; i < url.length; i++)
					urlTail += url[i];
				if (urlTail.length > 1)
					result.Tail = HttpPath.Build(urlTail);
			}
			return result;
		}
		public ToString(): string {
			return (this.tail) ? this.head + "/" + this.tail.ToString() : this.head;
		}
	}
}
