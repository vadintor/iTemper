import { User } from '@/models/user';

import { Storage } from '@/services/storage-service';

export class PersistentUser extends User {

    private mStorage: Storage<User>;

    constructor() {
        super();
        this.mStorage = new Storage<User>('itemper-key');
        const item =  this.mStorage.getItem();
        if (item) {
            this.mEmail = item.email;
            this.mPassword = item.password;
        }
    }

    public get email(): string {
        return this.mEmail;
    }

    public set email(value: string) {
        this.mEmail = value;
        this.mStorage.setItem(this);
    }

    public get password(): string {
        return this.mPassword;
    }

    public set password(value: string) {
        this.mPassword = value;
        this.mStorage.setItem(this);
    }

}

export const user = new PersistentUser();
