import { LogLevel } from '@/models/admin';
import { IAdminService } from '@/services/admin-service';
export class Admin {
    public mLevel: LogLevel = LogLevel.undefined;
    public mError: string = '';
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

    public reset(): void {
        this.mLevel = LogLevel.undefined;
    }

    public updateLevel(newLevel: LogLevel): Promise<boolean> {
        this.resetError();
        return new Promise ((resolve, reject) => {
            this.adminService.setLogLevel(newLevel)
            .then((updated: boolean) => {
                if (!updated) {
                    reject({status: 94, message: 'Log level could not be changed'});
                } else {
                    this.level = newLevel;
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
