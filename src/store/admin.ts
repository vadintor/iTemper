import { Vue  } from 'vue-property-decorator';
import { LogLevel } from '@/models/admin';
import { IAdminService } from '@/services/admin-service';
export class Admin {

    public mError: string = '';
    private mLevel: LogLevel = LogLevel.error;
    private adminService: IAdminService;

    constructor(adminService: IAdminService) {
        this.adminService = adminService;
    }
    public get level(): LogLevel {
        return this.mLevel;
    }

    public set level(value: LogLevel) {
        this.mLevel = value;
    }

    public resetLevel(): Promise<boolean>  {
        return new Promise ((resolve, reject) => {
            this.adminService.setLogLevel(LogLevel.error)
            .then((updated: boolean) => {
                if (!updated) {
                    reject({status: 94, message: 'Log level could not be reset'});
                } else {
                    Vue.set(this, 'mLevel', LogLevel.error);
                    resolve(true);
                }
            })
            .catch((e: any) => reject(e));
        });
    }

    public updateLevel(newLevel: LogLevel): Promise<boolean> {
        this.resetError();
        return new Promise ((resolve, reject) => {
            this.adminService.setLogLevel(newLevel)
            .then((updated: boolean) => {
                if (!updated) {
                    reject({status: 94, message: 'Log level could not be updated'});
                } else {
                    Vue.set(this, 'mLevel', newLevel);
                    resolve(true);
                }
            })
            .catch((e: any) => reject(e));
        });
    }
    private resetError() {
        this.mError = '';
    }
}
