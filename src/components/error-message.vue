<template>
    <div>
        <p v-if="error"> {{ errorMessaghe }} </p>
    </div>
</template>
<script lang="ts">
import {defineComponent, ref} from '@vue/composition-api';

import { log } from '@/services/logger';

function useErrorMessages() {
    const error = ref (false);
    const errorMessage = ref('');

    return { error, errorMessage };
}

export default defineComponent( {
    setup(): any {
        const {error, errorMessage} = useErrorMessages();

        return {error, errorMessage};
    },
});
</script>