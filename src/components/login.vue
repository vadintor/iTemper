<template>
<div>
        <v-card  >
            <v-form v-model="valid" ref="login">

                <v-text-field
                label="E-mail"
                v-model="email"
                :rules="emailRules"
                required
                ></v-text-field>

                <v-text-field
                label="Password"
                v-model="password"
                :rules="passwordRules"
                required
                ></v-text-field>

                <v-checkbox
                label="I agree to iTemper's terms and conditions"
                v-model="checkbox"
                :rules="[(v) => !!v || 'You must agree to continue!']"
                required
                ></v-checkbox>

                <v-btn @click="submit" :class="{ red: !valid, green: valid }">submit</v-btn>

                <v-btn @click="clear">clear</v-btn>

            </v-form>
        </v-card>
</div>
</template>

<script lang="ts">
import {Vue, Component} from "vue-property-decorator"

type BooleanOrString = boolean|string;
type ValidationFunction = (value: string) => BooleanOrString;

@Component({})
export default class Login extends Vue {
    valid: Boolean =  false;
    password: String = '';
    email: string = '';
    checkbox: boolean = true;
    select: string = '';
    passwordRules: Array<ValidationFunction> = [
          (v) => !!v || 'Enter password',
          (v) => v && v.length >= 8 || 'Password must be at least 8 characters'
        ];
    emailRules: Array<ValidationFunction> = [
          (v) => !!v || 'Enter  E-mail address',
          (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Invalid E-mail address'
        ];
     
    submit() {
        this.$refs.form.validate()
    }
      
    clear() {
        this.$refs.form.reset()
    }
}   
</script>

<style>

</style>