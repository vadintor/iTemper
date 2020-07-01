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
        <new-device-card></new-device-card>
    </v-dialog>
</template>
<script lang="ts">

import * as moment from 'moment-timezone';

import {Vue, Component, Watch, Prop} from 'vue-property-decorator';
import NewDeviceCard from './new-device-card.vue';

// Models
// import * as locations from '@/models/locations'
import { Device } from '@/features/devices';

import { log } from '@/services/logger';
import {json, copyToClipboard } from '@/helpers';

type BooleanOrString = boolean | string;
type ValidationFunction = (value: string) => BooleanOrString;

@Component({
    components: { NewDeviceCard },
})
export default class NewDeviceDialogue extends Vue {
    public dialog: boolean = false;
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
