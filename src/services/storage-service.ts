export class Storage<T> {

    protected key: string;

    constructor(key: string, item?: T) {
        this.key = key;
        if (item) {
            this.setItem(item);
        }
    }

    public setItem(item: T) {
        const itemStr = JSON.stringify(item);
        localStorage.setItem(this.key, itemStr);
    }

    public getItem(): T | undefined {
        const itemStr = localStorage.getItem(this.key);
        if (itemStr) {
            return JSON.parse(itemStr);
        } else {
            return undefined;
        }
    }

    public isValid(): boolean {
        return localStorage.getItem(this.key) !== null;
    }

    public removeItem() {
        localStorage.removeItem(this.key);
    }

}
