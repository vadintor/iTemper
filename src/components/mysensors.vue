<template>
  <div>Sensor component</div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import * as ss from '@/services/sensor-service'

import { log } from '@/services/logger';

import { Sensor } from '@/models/sensors';

@Component({})
export default class MySensors extends Vue {
  sensors: Sensor[] = [];
  getSensorData() {
      let self = this;
      ss.getSensors()
      .then ((resolve) => {
          self.sensors = [];
          for (const sensor of resolve) {
              self.sensors.push(sensor);
          }
          // this.commit(self.state.sensors, resolve);
      })
      .catch((error: any) => {
          console.error('getSensorData',JSON.stringify(error))
      })
  }
}


</script>