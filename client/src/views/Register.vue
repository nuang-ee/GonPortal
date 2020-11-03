<template>
    <v-row justify="center">
        <v-col sm="7">
            <v-card class="mt-4">
                <v-toolbar color="teal lighten-3" dark flat>
                    <v-toolbar-title>Register</v-toolbar-title>
                </v-toolbar>

                <v-card-text>
                    <v-container>
                        <small>all fields are required.</small>
                        <v-form ref="form" v-model="valid">
                            <v-row>
                                <v-col cols="12" sm="6" md="6">
                                    <v-text-field
                                        v-model="user.username"
                                        color="teal lighten-2"
                                        label="Username*"
                                        hint="로그인 시 이용됩니다."
                                        :rules="rules.username"
                                        persistent-hint
                                        required
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                    <v-text-field
                                        v-model="user.password"
                                        color="teal lighten-2"
                                        label="Password*"
                                        type="password"
                                        :rules="rules.password"
                                        required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                    <v-text-field
                                        v-model="user.name"
                                        color="teal lighten-2"
                                        label="이름*"
                                        :rules="rules.text"
                                        required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                    <v-text-field
                                        v-model="user.sNum"
                                        color="teal lighten-2"
                                        label="학번*"
                                        hint="ex) 20151684"
                                        :rules="rules.num"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-select
                                        v-model="user.semester"
                                        color="teal lighten-2"
                                        label="재학 학기*"
                                        hint="ex) 현재 3학기째 재학중 -> '3'"
                                        persistent-hint
                                        :items="items"
                                        :rules="rules.text"
                                        required
                                    ></v-select>
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        v-model="user.email"
                                        color="teal lighten-2"
                                        label="Email*"
                                        hint="카이스트 구성원 인증을 위하여 카이스트 메일이어야 합니다."
                                        persistent-hint
                                        :rules="rules.text"
                                        required
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        v-model="user.phoneNum"
                                        color="teal lighten-2"
                                        label="phone number*"
                                        hint="리크루팅 관련 정보 전달을 위해 사용되며, 이후 폐기됩니다."
                                        persistent-hint
                                        :rules="rules.text"
                                        required
                                    >
                                    </v-text-field>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        class="mb-1 mr-3"
                        color="teal accent-4"
                        text
                        :disabled="!valid || loading"
                        v-on:click="handleRegister"
                        >Register</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-col>
        <v-snackbar v-model="viewRegisterStatus" :timeout="timeout">
            {{ resultMessage }}
            <template v-slot:action="{ attrs }">
                <v-btn
                    color="teal accent-4"
                    text
                    v-bind="attrs"
                    @click="viewRegisterStatus = false"
                >
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Watch } from "vue-property-decorator";
import User from "../models/user";
import * as _ from "lodash";

@Component({})
export default class Register extends Vue {
    // Rules
    requiredRule = (val: string) => val?.length > 0 || "This field is required";
    numberRule(info: string) {
        return (val: string) =>
            !isNaN(Number(val)) || `${info} number should only contain numbers`;
    }
    rangeRule(info: string, min: number, max: number) {
        return (val: string) =>
            (val && val.length >= min && val.length <= max) ||
            `${info} should be ${min} to ${max} characters long.`;
    }
    // Data
    items: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    user: User = new User();
    rules: any = {
        num: [this.requiredRule, this.numberRule("Student number")],
        text: [this.requiredRule],
        username: [this.requiredRule, this.rangeRule("Username", 4, 20)],
        password: [this.requiredRule, this.rangeRule("Password", 8, 20)],
    };
    valid = false;
    conditions = false;
    loading = false;
    viewRegisterStatus = false;
    resultMessage = "";
    timeout = 2000;

    // watcher
    @Watch("user")
    onPropertyChanged(value: User, oldValue: User) {
        this.debouncedCheckValid();
    }

    // Component methods
    async handleRegister() {
        this.loading = true;
        if (this.formIsValid) {
            try {
                const responseMsg = await this.$store.dispatch(
                    "auth/register",
                    this.user
                );
                if (responseMsg) {
                    this.loading = false;
                    alert(responseMsg);
                    this.$router.push("/home");
                }
            } catch (e) {
                this.loading = false;
                this.viewRegisterStatus = true;
                this.resultMessage = e.toString();
            }
        }
    }
    checkValid() {
        console.log(this.formIsValid);
        if (this.formIsValid) {
            this.valid = true;
        }
    }

    debouncedCheckValid() {
        _.debounce(this.checkValid, 500);
    }

    // computed values.
    get formIsValid() {
        return (
            this.user.username &&
            this.user.password &&
            this.user.name &&
            this.user.sNum &&
            this.user.semester &&
            this.user.email
        );
    }
    get loggedIn() {
        return this.$store.state.auth.status.loggedIn;
    }

    // Lifecycle hooks
    mounted() {
        if (this.loggedIn) {
            this.$router.push("/home");
        }
    }
}
</script>

<style scoped></style>
