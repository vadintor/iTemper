import axios, { Method, AxiosInstance } from 'axios';

import { User } from '@/models/user';

import { iTemperAPI } from '@/config';
import { json } from '@/helpers/';
import { log } from '@/services/logger';

export interface IApiService {
    isLoggedIn: boolean;
    register(email: string, password: string, confirmPassword: string): Promise<User>;
    login(email: string, password: string): Promise<User>;
    logout(): void;
    request(method: Method, url: string, body?: any): Promise<any>;
}

export type Method = Method;

export class ApiService implements IApiService {

    public isLoggedIn: boolean = false;

    private io: AxiosInstance;
    private token: string | undefined = undefined;
    private ContentTypeHeader = {'Content-Type': 'application/json'};

    constructor() {
        this.io = axios.create({
            baseURL: iTemperAPI,
            headers: this.ContentTypeHeader,
        });
    }

    // public get isLoggedIn(): boolean {
    //     return this.token !== undefined;
    // }
    public register(email: string, password: string, confirmPassword: string): Promise<User> {
        log.debug('ApiService.register');
        const url = '/signup';
        const body = JSON.stringify({email, password, confirmPassword});
        return this.post(url, body);
    }
    public login(email: string, password: string): Promise<User> {
        log.debug('ApiService.login');
        const url = '/login';
        const body = JSON.stringify({email, password});
        return this.post(url, body);
    }

    public logout() {
        log.debug('ApiService.logout');
        this.token = undefined;
        this.isLoggedIn = false;
    }

    public Authorization() {
        log.debug('ApiService.Authorization');
        if (this.token) {
            return {value: 'Bearer ' + this.token};
        } else {
            return { value: 'Bearer '};
        }
    }

    public request(method: Method, url: string, body?: any): Promise<any> {
        log.debug('ApiService.request: ' + method.toUpperCase() + ' ' + url);
        return new Promise<any> ((resolve, reject) => {
                if (!this.isLoggedIn) {
                        reject('User is not logged');
                }
                const Authorization = {Authorization: this.Authorization().value};
                this.io.request({url, method, headers: Authorization, data: body})
                .then ((response) => {
                        const data = response.data.slice();
                        resolve(data);
                })
                .catch((error: any) => {
                    let msg = 'Something happened, try again later';
                    if (error.response) {
                        msg = error.response.status + ': ' + error.response.data;
                    } else if (error.request) {
                        log.debug(error.request);
                    } else {
                        log.debug('request Error=' + error.message);
                    }
                    reject(msg);
                });
        });
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
                log.debug('ApiService.login: error=' + json(err.response));
                reject(err.response);
            });
        });
    }
}
