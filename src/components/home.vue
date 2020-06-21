
<template>
    <div>
        <h1>Välkommen till itemper.io</h1>
        <admin-config-card></admin-config-card>
    </div>
</template>
<script lang='ts'>

// Config
import {config} from '@/config';

// Services
import { log } from '@/services/logger';

// Vue
import { Vue, Component} from 'vue-property-decorator';
import AdminConfigCard from './admin-config-card.vue';
@Component({components: {
    AdminConfigCard,
}})
export default class Home extends Vue {

}
</script>
<style>
</style>