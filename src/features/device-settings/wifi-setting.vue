<template>
    <v-expansion-panel>
        <v-expansion-panel-header v-slot="{ open }">
        <v-row no-gutters>
            <v-col cols="1">
            <v-icon :color="wifiIconColor">mdi-wifi</v-icon>
            </v-col>
            <v-col cols="9">Wi-Fi</v-col>
            <v-col cols="1">
            <v-fab-transition leave-absolute v-if="!open">
                <span v-if="wifiOn" key="ssid">{{wifi.ssid}}
                </span>
                <span v-else key="1">Off
                </span>
            </v-fab-transition>
            </v-col>
        </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
        <v-row justify="left" no-gutters>
            <v-col cols="1"></v-col>
            <v-col cols="3">
            <v-switch v-model="wifiOn" @change="switchChanged" inset>
                <template v-slot:label>
                <span v-if="wifiOn">On</span>
                <span v-else>Off</span>
                </template>
            </v-switch>
            </v-col>
        </v-row>
        <v-row justify="left" no-gutters>
            <v-col cols="1"></v-col>
            <v-col cols="11">
            <v-list>
                <v-list-item v-if="(wifiOn && wifi.ssid !== '' || selectedNetwork.ssid !== '')">
                    <v-list-item-icon v-if="connecting">
                        <v-icon v-if="selectedNetwork.security === 'Open'">mdi-lock-open-outline</v-icon>
                        <v-icon v-else>mdi-lock-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-icon v-else>
                        <v-icon color="orange" v-if="wifi.security === 'Open'">mdi-lock-open-outline</v-icon>
                        <v-icon color="green" v-else>mdi-lock-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                    <v-list-item-title v-if="connecting">{{selectedNetwork.ssid}}</v-list-item-title>
                    <v-list-item-title v-else class="blue--text">{{wifi.ssid}}</v-list-item-title>
                    <v-list-item-subtitle v-if="connecting">Connecting...</v-list-item-subtitle>
                    <v-list-item-subtitle v-else>Connected</v-list-item-subtitle>
                    </v-list-item-content>
                        <v-list-item-action>
                            <v-tooltip left color="white black--text">
                                    <template v-slot:activator="{ on, value }">
                                    <v-btn icon 
                                        v-on="on"
                                        :class="{ 'on-hover': value }">
                                    <v-icon >mdi-information-outline</v-icon>
                                    </v-btn>
                                    </template>
                                    {{securityText(wifi.security)}}, channel {{wifi.channel}}, strength {{wifi.quality}} %
                            </v-tooltip>
                        </v-list-item-action>
                </v-list-item>
                <v-divider></v-divider>
                <v-subheader v-if="!wifiOn">Turn on Wi-Fi and select a network</v-subheader>
                <v-subheader v-else-if="wifi.ssid ===''">Available networks</v-subheader>
                <v-subheader v-else>Other networks</v-subheader>
                <v-list-item-group v-if="wifiOn" v-model="network" color="primary">
                    <v-list-item @click="selectNetwork(i)" v-for="(item, i) in otherNetworks" :key="i">
                        <v-list-item-icon>
                        <v-icon v-if="isSecured(item.security)">mdi-lock-outline</v-icon>
                        <v-icon v-else>mdi-lock-open-outline</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                        <v-list-item-title v-text="item.ssid"></v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-tooltip left color="white black--text">
                                    <template v-slot:activator="{ on, value }">
                                    <v-btn icon 
                                        v-on="on"
                                        :class="{ 'on-hover': value }">
                                    <v-icon >mdi-information-outline</v-icon>
                                    </v-btn>
                                    </template>
                                    {{securityText(item.security)}}, channel {{item.channel}}, strength {{item.quality}} %
                            </v-tooltip>
                        </v-list-item-action>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
            </v-col>
        </v-row>
        </v-expansion-panel-content>
        <v-dialog v-model="dialog" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">{{selectedNetwork.ssid}}</v-card-title>
                <v-card-text>
                    <v-text-field v-if="secured"
                        label="password"
                        v-model="password"
                        prepend-icon="fa-key"
                        :type="showPassword ? 'text' : 'password'"
                        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="showPassword = !showPassword"
                        :rules="[v => !!v || 'Password is required']"
                        required
                        :loading="connecting"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="orange" :disabled="connecting" text @click="resetPassword">Cancel</v-btn>
                <v-btn color="orange" :disabled="connecting" text @click="connectWiFi">Connect</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-expansion-panel>
</template>
<script lang="ts">
import { Vue } from 'vue-property-decorator';
import { computed, defineComponent, onMounted, reactive, Ref, ref, UnwrapRef, watch, watchEffect } from '@vue/composition-api';
import { log } from '@/services/logger';
import useDeviceState from '../devices/use-device-state';
import { WiFiNetwork } from '../devices//device-data';

export default defineComponent({
  name: 'WiFiSetting',
  components: {},

  setup(props, context) {
    const { deviceState } = useDeviceState();
    const dialog =  ref(false);
    const network = ref(-1);
    const selectedNetworkIndex = ref(-1);
    const wifi = deviceState.networks.current;
    const wifiOn =  ref(false);
    const password = ref('');
    const showPassword = ref(false);
    const connecting = ref(false);
    watchEffect(() => {
        if (!wifiOn.value && deviceState.networks.current.ssid !== '') {
            wifiOn.value = true;
        }
    });
    const otherNetworks = computed(() =>  deviceState.networks.available
                .filter((n: WiFiNetwork) => wifiOn && n.ssid !== deviceState.networks.current.ssid)
                .sort((a, b) => b.quality - a.quality));
    const wifiIconColor = computed(() => wifiOn.value ? 'green' : 'gray');
    const selectedNetwork = computed(() =>  0 <= selectedNetworkIndex.value &&
                                            selectedNetworkIndex.value < otherNetworks.value.length
                                            ? otherNetworks.value[selectedNetworkIndex.value]
                                            : {ssid: '', security: '', quality: 0, channel: 0 });
    const secured = computed (() => selectedNetwork.value.security !== '' &&
                                    selectedNetwork.value.security !== 'Open' );
    const securityIcon = (net: WiFiNetwork) => {
          return net.security === 'Open'
          ? 'mdi-lock-open-outline'
          : 'mdi-lock-outline';
    };
    const isSecured = (security: string) => {
        return security !== '' && security !== 'Open';
    };
    const switchChanged = (switchedOn: boolean) => {
      if (!switchedOn) { wifi.ssid = ''; }
    };
    const connectWiFi = () => {
        connecting.value = true;
        setTimeout(() => {
            const ssid = selectedNetwork.value.ssid.slice();
            const security = selectedNetwork.value.security.slice();
            const quality = selectedNetwork.value.quality;
            const channel = selectedNetwork.value.channel;
            deviceState.networks.current.ssid = ssid;
            deviceState.networks.current.security = security;
            deviceState.networks.current.quality = quality;
            deviceState.networks.current.channel = channel;

            resetPassword();
        }, 1500);

    };
    const selectNetwork = (index: number) => {
            selectedNetworkIndex.value = index;
            dialog.value = true;
    };
    const resetPassword = () => {
        selectedNetworkIndex.value = -1;
        dialog.value = false;
        password.value = '';
        connecting.value = false;
    };
    const securityText = (security: string) => {
        return isSecured(security) ? security : 'Open network';
    };
    log.debug('wifi-setting.setup');
    return {connecting, deviceState, connectWiFi, dialog, isSecured, otherNetworks, resetPassword,
            password, secured, securityText, showPassword, selectedNetworkIndex, selectNetwork,
            switchChanged, network, wifi, wifiIconColor, wifiOn, selectedNetwork} ;
  },
});
</script>
<style scoped>
.v-btn {
transition: opacity 0.3s ease-in-out;

}

.v-btn:not(.on-hover) {
opacity: 0.6;
}

</style>>