
import { PersistentUser } from '@/store/persistent-user';

export interface IUser {
    email: string;
    password: string;
}

export enum Status {
    LOGGED_OUT,
    LOGGING_IN,
    LOGGED_IN,
}
export class User  implements IUser {

    public static create(from: string): User {
        const user: IUser = JSON.parse(from);
        return user as User;
    }

    public mEmail: string = '';
    public mPassword: string = '';
    public mConfirmPassword: string = '';
    public mFirstName: string = '';
    public mLastName: string = '';
    public status: Status = Status.LOGGED_OUT;

    constructor(email: string = '', password: string = '') {
        this.mEmail = email;
        this.mPassword = password;
    }

    public get email(): string {
        return this.mEmail;
    }

    public set email(value: string) {
        this.mEmail = value;
    }

    public get password(): string {
        return this.mPassword;
    }

    public set password(value: string) {
        this.mPassword = value;

    }

    public hasEmail(): boolean {
        return this.mEmail.length > 0;
    }

    public hasPassword(): boolean {
        return this.mPassword.length > 0;
    }
}
