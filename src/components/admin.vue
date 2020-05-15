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
                        <div class="overline mb-4">OVERLINE</div>
                        <v-list-item-title class="headline mb-1">Log Level</v-list-item-title>
                        <v-list-item-subtitle>Sets itemper backend service's Log Level</v-list-item-subtitle>
                        <v-chip 
                            transition="scale-transition"  
                            close>
                                {{state.admin.mLevel}}
                        </v-chip>
                    </v-list-item-content>

                    <v-list-item-avatar
                        tile
                        size="80"
                        color="grey"
                    ></v-list-item-avatar>
                    </v-list-item>

                    <v-card-actions>
                        <v-btn :disabled="submitted" text color="orange" @click.native="onDebug()">Debug</v-btn>
                        <v-btn :disabled="submitted" text color="orange" @click.native="onInfo()">Info</v-btn>
                        <v-btn :disabled="submitted" text color="orange" @click.native="onInfo()">Error</v-btn>
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


export default class MyDevices extends Vue {

    public state = Vue.$store;

    public submitted: boolean = false;
    public errorMsg = '';
    public timeout: number = 2_000;

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
                if (this.state.admin.level != newLevel) {
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

    public logLevel() {
        return this.state.admin.level;
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