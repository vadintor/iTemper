<template>
<div >
    <v-container fluid grid-list-md>
        <v-layout row wrap>
            <v-flex>
                <v-card
                    class="mx-auto"
                    max-width="344"
                    outlined
                >
                    <v-list-item three-line>
                        <v-list-item-content>
                            <v-list-item-title class="headline mb-1">Loggnivå: <v-menu bottom offset-y>
                                    <template v-slot:activator="{ on }">
                                        <v-btn  v-on="on" :color="color()" text-color="white" ripple >
                                            {{levelName()}}
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item
                                            @click="onDebug()"
                                        >
                                        <v-list-item-title>Debug</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item
                                            @click="onInfo()"
                                        >
                                        <v-list-item-title>Info</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item
                                            @click="onError()"
                                        >
                                        <v-list-item-title>Error</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu></v-list-item-title>
                            <v-list-item-subtitle>Anger detaljnivå på tjänsteloggar</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-card-actions >
                    </v-card-actions>
                </v-card>                       
            </v-flex>
        </v-layout>
    </v-container>
</div>
</template>


<script lang="ts">
import * as moment from 'moment-timezone';
import {Vue, Component, Watch} from 'vue-property-decorator';
// Models

import { LogLevel } from '@/models/admin';

// Services

import { log } from '@/services/logger';


@Component({})
export default class Admin extends Vue {

    public state = Vue.$store;
    public submitted: boolean = false;
    public errorMsg = '';
    public timeout: number = 2_000;
    public level: LogLevel = LogLevel.error;

    public created(): void {
        log.debug('Admin.created()');
    }

    public levelName(): string {
        log.debug('levelName=' + LogLevel[this.level]);
        return LogLevel[this.state.admin.level];
    }
    public color() {
        log.debug('color, level=' + this.state.admin.level);
        switch (this.state.admin.level) {
            case LogLevel.debug: {
                return 'red';
            }
            case LogLevel.info: {
                return 'orange';
            }
            case LogLevel.error: {
                return 'green';
            }
            case LogLevel.undefined: {
                return 'grey';
            }
        }
    }
    public onDebug() {
            log.debug('admin.onDebug: level=' + LogLevel[this.level]);
            log.startLogging();
            this.level = LogLevel.debug;
            this.submitLevel(this.level);
    }
    public onInfo() {
            log.debug('admin.onInfo: level=' + LogLevel[this.level]);
            log.startLogging();
            this.level = LogLevel.info;
            this.submitLevel(this.level);
    }
    public onError() {
            log.debug('admin.onError: level=' + LogLevel[this.level]);
            log.stopLogging();
            this.level = LogLevel.error;
            this.submitLevel(this.level);
    }
    public submitLevel(newLevel: LogLevel) {
        if (this.state.admin.level === newLevel) {
            log.debug('admin.submitlevel: no changes');
            return;
        } else {
            log.debug('admin.submitlevel: update log level: ' +  LogLevel[newLevel]);
            this.submitted = true;
            this.state.admin.updateLevel(newLevel)
            .then(() => {
                this.level = this.state.admin.level;
                this.submitted = false;
                if (this.level !== LogLevel.error) {
                    this.setLoggingTimeout();
                }
            })
            .catch((err) => {
                this.submitted = false;
                this.displayError('error (' + err.status + '): ' + err.message);
            });
        }
    }
    public isError(): boolean {
        return this.errorMsg !== '';
    }
    private resetLogging(): void {
        this.submitted = true;
        this.state.admin.resetLevel()
        .then(() => {
            this.level = this.state.admin.level;
        })
        .catch((err) => {
            this.submitted = false;
            this.displayError('error (' + err.status + '): ' + err.message);
        });
    }
    private setLoggingTimeout() {
        const timeout = 60_000;
        setTimeout(() => {this.resetLogging(); }, timeout);
    }
    private resetErrorMsg(): void {
        this.errorMsg = '';
    }
    private displayError(msg: string) {
        this.errorMsg = msg;
        this.setErrorMsgTimeout();
    }
    private setErrorMsgTimeout() {
        const timeout = 2_500;
        setTimeout(() => {this.resetErrorMsg(); }, timeout);
    }

}

</script>

<style scoped>

.trans-0 {
    background-color: rgba(227, 153, 0, 0.7);
}

.trans-1 {
    background-color: rgba(153, 10, 227, 0.7);
}

.trans-2 {
    background-color: rgba(153, 0, 0, 0.7);
}

.trans-3 {
    background-color: rgba(10, 153, 227, 0.7);
}

.trans-4 {
    background-color: rgba(0, 10, 153, 0.7);
}

.trans-5 {
    background-color: rgba(0, 227, 30, 0.7);
}

.highcharts-background {
    background-color: rgba(255, 255, 255, 0.1);
}

</style>
