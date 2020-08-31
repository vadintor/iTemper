<template>
    <v-expansion-panel  @change="onChange">
        <v-expansion-panel-header v-slot="{ open }">
            <v-row no-gutters>
                <v-col cols="1">
                    <v-icon :color="iconColor" v-text="icon"/>
                </v-col>
                <v-col cols="7" v-text="name"/>
                <v-col cols="4">
                    <v-fab-transition leave-absolute v-if="!open">
                        <slot name="header">
                            <span v-if="isOn" v-text="value"/>
                            <span v-else v-text="off"/>
                        </slot>
                    </v-fab-transition>
                </v-col>
            </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-row no-gutters>
                <v-col cols="1"></v-col>
                <v-col cols="11">
                    <slot>
                    </slot>
                </v-col>
            </v-row>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { log } from '@/services/logger';

export default defineComponent({
    name: 'DeviceSetting',
    components: {},
    props: {
        name: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            default: 'mdi-alpha-d-circle-outline',
        },
        iconColor: {
            type: String,
            default: 'gray',
        },
        isOn: {
            type: Boolean,
            default: true,
        },
        off: {
            type: String,
            default: 'Off',
        },
  },
  setup(props, context) {
    const onChange = () => {
        context.emit('change');
    };
    log.debug('DeviceSetting.setup');
    return { onChange };
  },
});
</script>
