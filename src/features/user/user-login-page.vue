<template>
<div height="1500">
    <login-card @onLogin="login" @onRegister="swap"></login-card>
</div>
</template>

<script lang="ts">
// Vue
import { Component, Prop, Vue } from 'vue-property-decorator';
import LoginCard from '@/features/user/user-login-card.vue';
import Notice from '@/components/notice.vue';

// Store
import { Status } from '@/store/user';

// Services & helpers
import {log} from '@/services/logger';
import { router } from '@/helpers';

@Component({
    components: {
        Notice,
        LoginCard,
    },
})
export default class LoginPage extends Vue {
    public store = Vue.$store;
    public returnUrl = '/';

    public login(status: Status) {
        this.store.notice.publish('Welcome to itemper!');
        log.debug('Login.login: status=' + Status[status]);
        if (this.returnUrl) {
            router.push(this.returnUrl);
        } else {
            router.push({name: 'locations'});
        }
    }
    public swap() {
        router.push({name: 'register'});
    }
}
</script>

<style>
</style>