import { iTemperAPI } from '@/config';
import { LogLevel } from '@/models/admin';

import {json} from '@/helpers';
import { log } from '@/services/logger';
import { IApiService, Method } from '@/services/api-service';

export interface IAdminService {
        setLogLevel(level: LogLevel): Promise<boolean>;
}

export class AdminService implements IAdminService {

    private api: IApiService;
    private path: string = '/admin';
    constructor(apiService: IApiService) {
        this.api = apiService;
    }
    public setLogLevel(newLevel: LogLevel): Promise<boolean> {
        const method: Method = 'put';
        const path = this.path;
        const body = { level: LogLevel[newLevel] };
        return this.api.request(method, path, body);
    }
}
