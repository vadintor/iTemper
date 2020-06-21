
<template>
    <div v-if="development">
        <v-chip
        class="ma-2"
        color="pink"
        label
        text-color="white"
        >
            Development
        </v-chip>
    </div>
</template>
<script lang='ts'>
import {config} from '@/config';

import { Vue, Component} from 'vue-property-decorator';

import { log } from '@/services/logger';
@Component({})
export default class DevelopmentLabel extends Vue {
    public development = config.development;
}
</script>
<style>
</style>