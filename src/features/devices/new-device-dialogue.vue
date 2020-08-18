<template>
    <v-dialog v-model="dialog" persistent max-width="800">
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
        <device-stepper @close="dialog = false"></device-stepper>
    </v-dialog>
</template>
<script lang="ts">

import { ref, defineComponent } from '@vue/composition-api';
import { Vue } from 'vue-property-decorator';
import DeviceStepper from './device-stepper.vue';

export default defineComponent({
  name: 'NewDeviceDialogue',
  components: {
     DeviceStepper,
     },

  setup(props, context) {
      const dialog =  ref(false);
      return { dialog };
  },
});

</script>

<style scoped>

</style>
