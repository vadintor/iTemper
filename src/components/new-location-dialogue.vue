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
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </v-fab-transition>
        </template>
        <v-card>
            <v-card-title class="headline">New location</v-card-title>
            <v-card-text>
                <p>Create a NEW location.</p>
                <v-form v-model="valid" ref="location">
                    <v-text-field
                        label="Enter location name"
                        prepend-icon="mdi-radio-tower"
                        v-model="locationName"
                        :rules="nameRules"
                        required
                        clearable
                        :loading="submitted"
                    ></v-text-field>
                    <v-file-input
                        label="Background image"
                        show-size counter chips
                        v-model="locationImage"
                        prepend-icon="mdi-camera"
                    ></v-file-input>
                    <v-color-picker
                        v-model="color"
                        hide-canvas
                        hide-inputs
                        hide-mode-switch
                        show-swatches
                        :swatches="swatches" 
                        class="mx-auto"
                    ></v-color-picker>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <p v-if="error()"  class="red--text" align="center">{{errorMsg}}</p>
                <p v-else></p>
                <v-spacer></v-spacer>
                <v-btn text color="orange" :disabled="!valid" :loading="submitted"  @click="submit">Save</v-btn>
                <v-btn text  @click="close">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script lang="ts">

import * as moment from 'moment-timezone';

import {Vue, Component, Watch, Prop} from 'vue-property-decorator';

// Models
// import * as locations from '@/models/locations'
import { Device } from '@/models/device';

import { log } from '@/services/logger';
import {json, copyToClipboard } from '@/helpers';

type BooleanOrString = boolean | string;
type ValidationFunction = (value: string) => BooleanOrString;

@Component({})
export default class NewLocationDialogue extends Vue {
    public settings = Vue.$store.settings;
    public locationName: string = '';
    public locationKey: string = '';
    public locationImage = null;
    public color: string = '#e39900';
    public swatches =  [
        ['#e39900', '#990ae3', '#990000'],
        ['#0a99e3', '#000a99', '#00e31e'],
        ['#00FF00', '#00AA00', '#005500'],
        ['#00FFFF', '#00AAAA', '#005555'],
        ['#0000FF', '#0000AA', '#000055'],
      ];
    public dialog: boolean = false;
    public valid: boolean =  false;
    public submitted: boolean = false;
    public errorMsg = '';
    public timeout: number = 2_000;
    public nameRules: ValidationFunction[] = [
          (v) => !!v || 'Enter name',
          (v) => /^[a-zA-Z0-9]+$/.test(v) && v.length >= 4 || 'Must be at least 4 characters, no white spaces or special characters allowed',
        ];

    public red: string = '';
    public green: string = '';
    public blue: string = '';
    public store = Vue.$store;
    public locations = Vue.$store.locations;
    public image(id: number): string {
            return '/img/' + 'uterum' + '.jpg';
    }
    public rgba() {
      return `RGBA(${this.red},${this.green},${this.blue},0.7)`;
    }
    public background() {
      return `background: ${this.rgba}`;
    }
    public submit() {
        if (!this.valid) {
            this.displayError('Locations form not valid');
            return;
        } else {
            log.debug('Image file' + json(this.locationImage));
            this.submitted = true;
            this.createLocation(this.locationName);
        }
    }
    public close() {
        this.dialog = false;
        this.locationName = '';
    }
    public error(): boolean {
        return this.errorMsg !== '';
    }
    private createLocation(name: string) {
        log.debug('new-device-dialogue.createLocation');
        this.submitted = true;
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
