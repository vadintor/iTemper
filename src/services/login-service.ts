import axios, { AxiosInstance } from 'axios';

import { User } from '@/models/user';

import { iTemperAPI } from '@/config';
import { json } from '@/helpers/';
import { log } from '@/services/logger';

export interface ILoginService {
    isLoggedIn: boolean;
    register(email: string, password: string, confirmPassword: string): Promise<User>;
    login(email: string, password: string): Promise<User>;
    logout(): void;
    Authorization(): { value: string};
}

export class LoginService implements ILoginService {

    public isLoggedIn: boolean = false;

    private io: AxiosInstance;
    private token: string | undefined = undefined;
    private ContentTypeHeader = {'Content-Type': 'application/json'};

    constructor() {
        this.io = axios.create({headers: this.ContentTypeHeader});
    }

    // public get isLoggedIn(): boolean {
    //     return this.token !== undefined;
    // }
    public register(email: string, password: string, confirmPassword: string): Promise<User> {
        log.debug('LoginService.register');
        const url = iTemperAPI + '/signup';
        const body = JSON.stringify({email, password, confirmPassword});
        return this.post(url, body);
    }
    public login(email: string, password: string): Promise<User> {
        log.debug('LoginService.login');
        const url = iTemperAPI + '/login';
        const body = JSON.stringify({email, password});
        return this.post(url, body);
    }

    public logout() {
        log.debug('LoginService.logout');
        this.token = undefined;
        this.isLoggedIn = false;
    }

    public Authorization() {
        log.debug('LoginService.Authorization');
        if (this.token) {
            return {value: 'Bearer ' + this.token};
        } else {
            return { value: 'Bearer '};
        }
    }

    private post(url: string, body: string): Promise<User> {
        return new Promise<User> ((resolve, reject) => {
            this.io.post(url, body)
            .then((response) => {
                this.token = response.data.token;
                const email = response.data.email;
                const password = response.data.password;
                const user = new User(email, password);
                this.isLoggedIn = true;
                resolve(user);
            })
            .catch((err: any) => {
                log.debug('LoginService.login: error=' + json(err.response));
                reject(err.response);
            });
        });
    }
}
