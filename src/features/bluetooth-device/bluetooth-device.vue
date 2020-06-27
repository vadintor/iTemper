<template>
    <v-card>
        <v-container fill-height fluid :class="color()">
            <v-layout fill-height>
                <v-flex  align-end flexbox>
                    <span  class="display-1">Bluetooth device </span>
                    <v-text-field class="display-1"
                                dense
                                required
                    >
                    </v-text-field>     
                    <p v-if="connected"> CPU vendor: {{ cpuVendor }}</p> 
                    <p v-if="connected"> CPU speed: {{ cpuSpeed }}</p> 
                    <p v-if="error !== ''">Error: {{ error }}</p> 
                </v-flex>
            </v-layout>
        </v-container>

        <v-card-actions>
                <v-btn v-if="!connected" text color="orange" @click.native="connect">Connect</v-btn>
                <v-btn v-else text color="orange" @click.native="disconnect">Disconnect</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script lang="ts">
// Vue
import {Vue, Component, Watch, Prop} from 'vue-property-decorator';

// Models

// Services & helpers
import { log } from '@/services/logger';
import { json, copyToClipboard } from '@/helpers';

// Features
import { WebBluetooth } from './web-bluetooth';

@Component({})
export default class BluetoothDevice extends Vue {
    public connected: boolean = false;
    public cpuVendor: string = '';
    public cpuSpeed: string = '';
    public error: string = '';

    private itemperBLE: WebBluetooth = new WebBluetooth();
    public async connect() {
        let step = 1;
        this.error = '';
        try {
            await this.itemperBLE.request();
            step += 1;
            await this.itemperBLE.connect();
            this.connected = true;
            log.debug('bluetooth-device.connect: connected');
            step += 1;
            await this.itemperBLE.setDeviceCharacteristic();
            step += 1;
            this.cpuVendor = await this.itemperBLE.readCPUVendor();
            step += 1;
            this.cpuSpeed = await this.itemperBLE.readCPUSpeed();
            step += 1;
        } catch (error) {
            this.error = 'bluetooth-device.connect: step ' + step + ' : ' + error.message;
            log.debug( this.error);
        }
    }
    public disconnect() {
        log.debug('bluetooth-device.disconnect: ');
        this.itemperBLE.disconnect();
        this.connected = false;
        this.error = '';
    }
    public color(): string {
        return 'overlay-3';
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
