<template>
  <div>Sensor component</div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import * as ss from '@/services/sensor-service';

import { log } from '@/services/logger';


@Component({})
export default class MySensors extends Vue {
  public sensors =  Vue.$store.sensors;
  public getSensorData() {
      this.sensors.getSensorsSamples(1);
    //   const self = this;
    //   ss.getSensors()
    //   .then ((resolve) => {
    //       for (const sensor of resolve) {
    //           self.sensors.push(sensor);
    //       }
    //       // this.commit(self.state.sensors, resolve);
    //   })
    //   .catch((error: any) => {
    //       console.error('getSensorData',JSON.stringify(error))
    //   })
  }

  public created() {
      log.debug('MySensors.created()');
  }
}
</script>