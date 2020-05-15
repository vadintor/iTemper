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
                            <v-list-item-title class="headline mb-1">Loggnivå</v-list-item-title>
                            <v-list-item-subtitle>Anger detaljnivå på tjänsteloggar</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-card-actions>
                        <v-btn-toggle v-model="text" color="orange" group borderless rounded tile>
                            <v-btn value="debug" :disabled="submitted" text @click.native="onDebug()">Debug</v-btn>
                            <v-btn value="info" :disabled="submitted" text @click.native="onInfo()">Info</v-btn>
                            <v-btn value="error" :disabled="submitted" text @click.native="onError()">Error</v-btn>
                        </v-btn-toggle>
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

    public level: LogLevel = LogLevel.undefined;

    public created(): void {
        log.debug('Admin.created()');
    }
    public onDebug() {
            this.submitLevel(LogLevel.debug);
    }
    public onInfo() {
            this.submitLevel(LogLevel.info);
    }
    public onError() {
            this.submitLevel(LogLevel.error);
    }
    public submitLevel(newLevel: LogLevel) {
        if (this.state.admin.level === newLevel) {
            log.debug('admin.submitlevel: no changes');
            return;
        } else {
            log.debug('admin.submitlevel: update log level: ' +  newLevel.toString());
            this.submitted = true;
            this.state.admin.updateLevel(newLevel)
            .then(() => {
                if (this.state.admin.level !== newLevel) {
                    // This whole if-statement is a workaround
                    // Since mutation should have been carried out in admin.updateLevel already
                    this.state.admin.level = newLevel;
                }
                this.submitted = false;
            })
            .catch((err) => {
                this.submitted = false;
                this.displayError('error (' + err.status + '): ' + err.message);
            });
        }
    }

    public error(): boolean {
        return this.errorMsg !== '';
    }
    private reset(): void {
        this.errorMsg = '';
    }
    private displayError(msg: string) {
        this.errorMsg = msg;
        this.setTimer();
    }
    private setTimer() {
        const timeout = 2_250;
        setTimeout(() => {this.reset(); }, timeout);
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
