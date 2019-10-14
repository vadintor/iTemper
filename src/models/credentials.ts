import { Storage } from '@/services/storage-service';

export interface ICredentials {
    email: string;
    password: string;
    token: string;
}

export class Credentials {
    public mEmail: string = '';
    public mPassword: string = '';
    public mConfirmPassword: string = '';
    public mToken: string = '';

    private mStorage: Storage<Credentials>;

    constructor(email: string = '', password: string = '') {
        this.mEmail = email;
        this.mPassword = password;
        this.mToken = '';
        this.mStorage = new Storage<Credentials>('itemper-key');
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

    public get confirmPassword(): string {
        return this.mConfirmPassword;
    }

    public set confirmPassword(value: string) {
        this.mConfirmPassword = value;
    }
    public hasEmail(): boolean {
        return this.mEmail.length > 0;
    }

    public hasPassword(): boolean {
        return this.mPassword.length > 0;
    }

    public get token(): string {
        return this.mToken;
    }

    public set token(value: string) {
        this.mToken = value;
        this.mStorage.setItem(this);
    }

}
