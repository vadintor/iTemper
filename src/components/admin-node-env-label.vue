
<template>
    <div>
        <v-chip
        class="ma-2"
        color="pink"
        label
        text-color="white"
        >
            {{ nodeEnv }}
        </v-chip>
    </div>
</template>
<script lang='ts'>

import { Vue, Component} from 'vue-property-decorator';

@Component({})
export default class AdminNodeEnvLabel extends Vue {
    public nodeEnv = process.env.NODE_ENV;
}
</script>
<style>
</style>