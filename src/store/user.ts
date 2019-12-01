import { Credentials } from '@/models/credentials';
import { IApiService } from '@/services/api-service';

import { log } from '@/services/logger';

export enum Status {
    LOGGED_OUT,
    LOGGING_IN,
    LOGGED_IN,
}
export class User  {
    public mFirstName: string = '';
    public mLastName: string = '';
    public credentials: Credentials;
    public mStatus: Status = Status.LOGGED_OUT;

    public api: IApiService;

    constructor(apiService: IApiService) {
        log.debug('user.ts constructor' + JSON.stringify(apiService));
        this.api = apiService;
        this.credentials = new Credentials();
    }
    public reset(): void {
        this.mFirstName = '';
        this.mLastName = '';
        this.credentials = new Credentials();
        this.status = Status.LOGGED_OUT;
    }
    public isLoggedIn(): boolean {
        return this.status === Status.LOGGED_IN;
    }
    public isLoggedOut(): boolean {
        return this.status === Status.LOGGED_OUT;
    }
    public get status() {
        return this.mStatus;
    }
    public set status(value: Status) {
        this.mStatus = value;
    }
    public register(): Promise<Status> {
        this.status = Status.LOGGING_IN;
        return new Promise<Status> ((resolve, reject) => {
            this.api.register(this.credentials.email, this.credentials.password, this.credentials.password)
            .then((cred) => {
                this.status = Status.LOGGED_IN;
                resolve(this.status);
            })
            .catch((error: any) => {
                reject(error);
            });
        });
    }
    public login(): Promise<Status>  {
        log.debug('user.ts Login');
        this.status = Status.LOGGING_IN;
        return new Promise<Status> ((resolve, reject) => {
            this.api.login(this.credentials.email, this.credentials.password)
            .then((cred) => {
                this.status = Status.LOGGED_IN;
                resolve(this.status);
            })
            .catch((error: any) => {
                reject(error);
            });
        });
    }
    public logout(): Promise<Status>  {
        return new Promise<Status> ((resolve, reject) => {
            this.status = Status.LOGGED_OUT;
            this.credentials.token = '';
            this.api.logout();
            resolve(this.status);
        });
    }
}

