<template>
    <v-dialog v-model="dialog" persistent max-width="500">
        <template v-slot:activator="{ on }">
            <v-fab-transition>
                <v-btn class="mx-2" 
                    v-on="on"
                    fab 
                    absolute
                    small
                    color="#2591E9"
                    bottom
                    left>
                    <v-icon>fa-plus</v-icon>
                </v-btn>
            </v-fab-transition>
        </template>
        <v-card>
            <v-card-title class="headline">New device</v-card-title>
            <v-card-text>
                <p>Create a NEW device.</p>
                <v-form v-model="valid" ref="device">
                    <v-text-field
                        label="Enter device name"
                        prepend-icon="fa-broadcast-tower"
                        v-model="deviceName"
                        :rules="nameRules"
                        required
                        clearable
                        :loading="submitted"
                    ></v-text-field>
                    <div v-if="deviceKey !== ''">
                    <p>

                        <span   class="d-inline-block text-truncate" 
                                style="max-width: 400px;">
                        <v-btn text icon @click="copy">
                            <v-icon >fa-clone</v-icon>
                        </v-btn>
                        <span id="deviceKey">{{ deviceKey }}</span>
                        </span>

                    </p>
                    <p class="font-weight-medium"><span>Copy the shared access key by clicking on the icon</span>
                    <v-icon >fa-clone</v-icon><span>above and store it securily. iTemper does not store the key for security reasons.</span></p>
                    </div>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <p v-if="error()"  class="red--text" align="center">{{errorMsg}}</p>
                <p v-else></p>
                <v-spacer></v-spacer>
                <v-btn text v-if="deviceKey === ''" color="orange" :disabled="!valid" :loading="submitted"  @click="submit">Save</v-btn>
                <v-btn text v-if="deviceKey === ''"  @click="close">Cancel</v-btn>
                <v-btn text v-if="deviceKey !== ''"  @click="close">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script lang="ts">

import * as moment from 'moment-timezone';

import {Vue, Component, Watch, Prop} from 'vue-property-decorator';

// Models
// import * as locations from '@/models/locations'
import { Device } from '@/features/devices';

import { log } from '@/services/logger';
import {json, copyToClipboard } from '@/helpers';

type BooleanOrString = boolean | string;
type ValidationFunction = (value: string) => BooleanOrString;

@Component({})
export default class NewDeviceDialogue extends Vue {
    public deviceName: string = '';
    public deviceKey: string = '';
    public dialog: boolean = false;
    public valid: boolean =  false;
    public submitted: boolean = false;
    public errorMsg = '';
    public timeout: number = 2_000;
    public nameRules: ValidationFunction[] = [
          (v) => !!v || 'Enter name',
          (v) => /^[a-zA-Z0-9]+$/.test(v) && v.length >= 4 || 'Must be at least 4 characters, no white spaces or special characters allowed',
        ];
    public store = Vue.$store;
    public devices = Vue.$store.devices;

    public submit() {
        if (!this.valid) {
            this.displayError('Device form not valid');
            return;
        } else {
            this.submitted = true;
            this.createDevice(this.deviceName);
        }
    }
    public close() {
        this.dialog = false;
        this.deviceKey = '';
        this.deviceName = '';
    }
    public error(): boolean {
        return this.errorMsg !== '';
    }
    private createDevice(name: string) {
        log.debug('new-device-dialogue.createDevice');
        this.submitted = true;
        this.devices.createDevice(name)
        .then((device: Device) => {
            this.submitted = false;
            this.deviceKey = device.key;
            this.store.notice.publish('Device ' + name + ' created');
        })
        .catch((error: any) => {
            this.submitted = false;
            this.displayError('Something went wrong: (' + error.status + '): ' + error.message );
        });
    }
    private reset(): void {
        this.errorMsg = '';
    }
    private displayError(msg: string) {
        this.errorMsg = msg;
        this.setTimer();
    }
    private setTimer() {
        const timeout = 1_250;
        setTimeout(() => {this.reset(); }, timeout);
    }
    private copy() {
        if (!copyToClipboard('deviceKey')) {
                this.displayError('Error: Cannot copy key to clipboard');
        }
    }
}

</script>

<style scoped>

.overlay-0 {
    background-color: rgba(227, 153, 0, 0.7);
}

.overlay-1 {
    background-color: rgba(153, 10, 227, 0.7);
}

.overlay-2 {
    background-color: rgba(153, 0, 0, 0.7);
}

.overlay-3 {
    background-color: rgba(10, 153, 227, 0.7);
}

.overlay-4 {
    background-color: rgba(0, 10, 153, 0.7);
}

.overlay-5 {
    background-color: rgba(0, 227, 30, 0.7);
}

.highcharts-background {
    background-color: rgba(255, 255, 255, 0.1);
}

</style>
