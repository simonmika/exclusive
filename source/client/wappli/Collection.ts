/// <reference path="Resource.ts"/>>

module Wappli{
	export class Collection<T extends { url?: string }> extends Resource<T[]> {
        private current: Resource<T>;
        public get Current() { return this.current; }
        constructor(service: Service, fetchUrl: (action: (url: string) => void) => void = null) {
            super(service, fetchUrl);
            this.current = new Wappli.Resource<T>(service, value => this.Get());
        }
        public Create(value: T, done: (succeeded: boolean) => void = null) {
            this.FetchUrl(url => {
                this.Service.Post<T>(url, value, (data: T) => {
                    if (data !== null)
                        this.Update(collection => {
                            collection.push(data);
                            this.Current.Set(data);
                            if (done !== null)
                                done(true);
                            return collection;
                        });
                    else if (done !== null)
                        done(false);
                });
            });
        }
        public Invalidate() {
            console.log("invalidate collection");
            super.Invalidate();
            this.Current.Invalidate();
        }
    }
}
