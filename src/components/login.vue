<template>
<div height="1500">
    <login-card @login="login" @register="swap"></login-card>
</div>
</template>

<script lang="ts">
// Vue
import { Component, Prop, Vue } from 'vue-property-decorator';
import LoginCard from '@/components/login-card.vue';
import Notice from '@/components/notice.vue';

// Store
import { Status } from '@/store/user';

// Services & helpers
import {log} from '@/services/logger';
import { router } from '@/helpers';
import {json} from '@/helpers';

@Component({
    components: {
        Notice,
        LoginCard,
    },
})
export default class Login extends Vue {
    public store = Vue.$store;
    public notice = Vue.$store.notice;

    public returnUrl: any;
    public login(status: Status) {
        this.store.notice.publish('Welcome to itemper!');
        log.debug('Login.LoggedIn: status=' + Status[status]);
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