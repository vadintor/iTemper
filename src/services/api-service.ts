import axios, { Method, AxiosInstance } from 'axios';

import { Credentials } from '@/models/credentials';

import { iTemperAPI } from '@/config';
import { json } from '@/helpers/';
import { log } from '@/services/logger';

export interface IApiService {
    isLoggedIn: boolean;
    register(email: string, password: string, confirmPassword: string): Promise<Credentials>;
    login(email: string, password: string): Promise<Credentials>;
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

    public register(email: string, password: string, confirmPassword: string): Promise<Credentials> {
        log.debug('ApiService.register');
        const url = '/signup';
        const body = JSON.stringify({email, password, confirmPassword});
        return this.post(url, body);
    }
    public login(email: string, password: string): Promise<Credentials> {
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
                    let msg = error.message;
                    if (error.response) {
                        msg = error.response.status + ': ' + error.response.data;
                    } else if (error.request) {
                        log.debug(error.request);
                    } else {
                        log.debug('request Error=' + error.message);
                    }
                    reject(error);
                });
        });
    }

    private Authorization() {
        log.debug('ApiService.Authorization');
        if (this.token) {
            return {value: 'Bearer ' + this.token};
        } else {
            return { value: 'Bearer '};
        }
    }
    private post(url: string, body: string): Promise<Credentials> {
        return new Promise<Credentials> ((resolve, reject) => {
            this.io.post(url, body)
            .then((response) => {
                log.debug(json(response));
                this.token = response.data.token;
                const email = response.data.email;
                const password = response.data.password;
                const credentials = new Credentials(email, password);
                credentials.token = this.token || '';
                this.isLoggedIn = true;
                resolve(credentials);
            })
            .catch((error: any) => {
                this.isLoggedIn = false;
                let msg = error.message;
                if (error.response) {
                    msg = error.response.status + ': ' + error.response.data;
                } else if (error.request) {
                    log.debug(error.request);
                } else {
                    log.debug('request Error=' + error.message);
                }
                reject(error);
            });
        });
    }
}
