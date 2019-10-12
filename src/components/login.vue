<template>
<div>
    <v-card  class="mx-auto mt-5">
        <v-card-title>
            <h3 v-if="!setup">Login to itemper</h3>
            <h3 v-else>Register an account</h3>
        </v-card-title>
        <v-card-text>
            <v-form v-model="valid" ref="login">
                <v-text-field v-if="setup"
                    label="First name"
                    v-model="user.mFirstName"
                    :rules="nameRules"
                    required
                    clearable
                ></v-text-field>

                <v-text-field v-if="setup"
                    label="Last name"
                    v-model="user.mLastName"
                    :rules="nameRules"
                    required
                    clearable
                ></v-text-field>

                <v-text-field
                    label="E-mail"
                    v-model="user.mEmail"
                    :rules="emailRules"
                    required
                    clearable
                ></v-text-field>

                <v-text-field
                    label="Password"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-icon="mdi-lock"
                    @click="showPassword = !showPassword"
                    v-model="user.mPassword"
                    :rules="passwordRules"
                    required
                    clearable
                ></v-text-field>
                <v-text-field v-if="setup"
                    label="Confirm password"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-icon="mdi-lock"
                    @click="showPassword = !showPassword"
                    v-model="user.mConfirmPassword"
                    :rules="confirmPasswordRules"
                    required
                    clearable
                ></v-text-field>
                <v-checkbox v-if="setup"
                    label="I agree to iTemper's terms and conditions"
                    v-model="checkbox"
                    :rules="[(v) => !!v || 'You must agree to continue!']"
                    required
                ></v-checkbox>
            </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions v-if="!setup">
            <v-btn @click="submit" :loading="submitted" color="info">Login</v-btn>
            <v-spacer><p align="center">Register if you don't have an account </p></v-spacer>
            <v-btn @click="swap" :disabled="submitted">Register</v-btn>

        </v-card-actions>
        <v-card-actions v-else>
            <v-btn @click="register" :loading="submitted" color="info">Register</v-btn>
            <v-spacer><p align="center">Allready have an account? </p></v-spacer>

            <v-btn @click="swap" :disabled="submitted">Login</v-btn>

        </v-card-actions>
    </v-card>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as itemper from '@/services/itemper';
import { store } from '@/store/store';
import { Status } from '@/models/user';
import { router } from '@/helpers';

import {log} from '@/services/logger';

import {json} from '@/helpers';


type BooleanOrString = boolean|string;
type ValidationFunction = (value: string) => BooleanOrString;


@Component({})
export default class Login extends Vue {
    public setup = false;
    public showPassword: boolean = false;
    public user = store.user;
    public valid: boolean =  false;
    public checkbox: boolean = false;
    public select: string = '';

    public submitted: boolean = false;
    public returnUrl: any;
    public error: string = '';
    public timeout: number = 5000;

    public passwordRules: ValidationFunction[] = [
          (v) => !!v || 'Enter password',
          (v) => v && v.length >= 7 || 'Password must be at least 7 characters',
        ];
    public confirmPasswordRules: ValidationFunction[] = [
          (v) => !!v || 'Please, re-ener password',
          (v) => v && v === this.user.mPassword || 'Does not match password',
        ];

    public emailRules: ValidationFunction[] = [
          (v) => !!v || 'Enter  E-mail address',
          (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Invalid E-mail address',
        ];
    public nameRules: ValidationFunction[] = [
          (v) => !!v || 'Enter name',
          (v) => /^\w/.test(v) && v.length >= 3 || 'Name must be at least 3 characters',
        ];
    public setEmail(email: string) {
        this.user.mEmail = email;
    }

    public login(email: string, password: string) {
        this.submitted = true;
        itemper.loginService.login(email, password)
        .then((user) => {
            this.submitted = false;
            this.user.status = Status.LOGGED_IN;
            log.debug('Login: returnUrl=' + this.returnUrl);
            if (this.returnUrl) {
                router.push(this.returnUrl);
            } else {
                router.push({name: 'locations'});
            }
        })
        .catch((error) => {
            this.submitted = false;
            this.error = error;
            this.user.status = Status.LOGGED_OUT;
        });
    }

    public register() {
        const email = this.user.mEmail;
        const password = this.user.mPassword;
        const confirmPassword = this.user.mConfirmPassword;
        this.submitted = true;
        itemper.loginService.register(email, password, confirmPassword)
        .then( (user) => {
            this.submitted = false;
            this.user.status = Status.LOGGED_IN;
            log.debug('Login: returnUrl=' + this.returnUrl);
            if (this.returnUrl) {
                router.push(this.returnUrl);
            } else {
                router.push({name: 'locations'});
            }
        })
        .catch((error) => {
            this.submitted = false;
            this.error = error.msg;
            this.user.status = Status.LOGGED_OUT;
        });

    }

    public submit() {
        if (!this.valid) {
            return;
        } else {
            this.submitted = true;
            this.login(this.user.mEmail, this.user.mPassword);
        }
        // this.$refs.form.validate()
    }

    public swap() {
        this.setup = !this.setup;
    }
}
</script>

<style>

</style>