<template>
<div height="1500">
    <v-card  class="mx-auto mt-5">
        <v-card-title>
            <h3>Login to itemper</h3>
        </v-card-title>
        <v-card-text>
            <v-form v-model="valid" ref="login">
                <v-text-field
                    label="E-mail"
                    prepend-icon="mdi-email"
                    v-model="cred.email"
                    :rules="emailRules"
                    required
                    clearable
                ></v-text-field>

                <v-text-field
                    label="Password"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-icon="mdi-lock"
                    @click="showPassword = !showPassword"
                    v-model="cred.password"
                    :rules="passwordRules"
                    required
                    clearable
                ></v-text-field>
            </v-form>
        </v-card-text>


        <v-divider></v-divider>
        <v-card-actions>
            <v-btn @click="submit" :disabled="!valid" :loading="submitted" color="info">Login</v-btn>
            <v-spacer>
                <p v-if="error()"  class="red--text" align="center">{{errorMsg}}</p>
                <p v-else align="center">Register if you don't have an account</p>
            </v-spacer>
            <v-btn @click="swap" :disabled="submitted">Register</v-btn>
        </v-card-actions>
    </v-card>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as itemper from '@/services/itemper';
import Notice from '@/components/notice.vue';
import { store } from '@/store/store';
import { Status } from '@/store/user';
import { router } from '@/helpers';

import {log} from '@/services/logger';

import {json} from '@/helpers';


type BooleanOrString = boolean | string;
type ValidationFunction = (value: string) => BooleanOrString;


@Component({
    components: {
        Notice,
    },
})
export default class Login extends Vue {
    public showPassword: boolean = false;
    public cred = Vue.$store.user.credentials;
    public status = Vue.$store.user.status;
    public notice = Vue.$store.notice;
    public user = Vue.$store.user;
    public valid: boolean =  false;
    public checkbox: boolean = false;
    public select: string = '';

    public submitted: boolean = false;
    public returnUrl: any;
    public errorMsg = '';
    public timeout: number = 2_000;

    public passwordRules: ValidationFunction[] = [
          (v) => !!v || 'Enter password',
          (v) => v && v.length >= 7 || 'Password must be at least 7 characters',
        ];
    public confirmPasswordRules: ValidationFunction[] = [
          (v) => !!v || 'Please, re-ener password',
          (v) => v && v === this.cred.password || 'Does not match password',
        ];

    public emailRules: ValidationFunction[] = [
          (v) => !!v || 'Enter E-mail address',
          (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Invalid E-mail address',
        ];
    public nameRules: ValidationFunction[] = [
          (v) => !!v || 'Enter name',
          (v) => /^\w/.test(v) && v.length >= 3 || 'Name must be at least 3 characters',
        ];
    public setEmail(email: string) {
        this.cred.email = email;
    }

    public error(): boolean {
        return this.errorMsg !== '';
    }
    public login(email: string, password: string) {
        log.debug('Login.vue login');
        this.submitted = true;
        this.user.login()
        .then((status: Status) => {
            this.submitted = false;
            store.notice.publish('Welcome to itemper!');
            log.debug('Login: returnUrl=' + this.returnUrl);
            if (this.returnUrl) {
                router.push(this.returnUrl);
            } else {
                router.push({name: 'locations'});
            }
        })
        .catch((error: any) => {
            this.submitted = false;
            this.displayError('Something went wrong: (' + error.status + '): ' + error.message );
        });
    }

    public submit() {
        if (!this.valid) {
            this.displayError('Login form not vallid');
            return;
        } else {
            this.submitted = true;
            this.login(this.cred.mEmail, this.cred.mPassword);
        }
    }

    public swap() {
        router.push({name: 'register'});
    }
    private reset(): void {
        this.errorMsg = '';
    }
    private displayError(msg: string) {
        this.errorMsg = msg;
        this.setTimer();
    }
    private setTimer() {
        const timeout = 1_250;
        setTimeout(() => {this.reset(); }, timeout);
    }
}
</script>

<style>

</style>