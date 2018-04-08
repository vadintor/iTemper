<template>
  <div>Sensor component</div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import { log } from '@/services/logger';

import { Sensor } from '@/models/sensors';

@Component({})
export default class MySensors extends Vue {
  @Prop({required: true, type: Array}) sensors: Sensor[] = [];

}


</script>