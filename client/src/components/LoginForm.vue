<template>
  <div id="login-form">
    <v-dialog v-model="dialog" max-width="400">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          :ripple="false"
          id="no-background-hover"
          light
          v-bind="attrs"
          v-on="on"
          text
        >
          Login
        </v-btn>
      </template>

      <v-card class="elevation-12">
        <v-toolbar color="light-green lighten-2" dark flat>
          <v-toolbar-title>Login form</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-tooltip bottom> </v-tooltip>
        </v-toolbar>
        <v-card-text>
          <v-form v-model="valid">
            <v-text-field
              v-model="username"
              class="mt-6"
              label="Username"
              name="username"
              prepend-icon="mdi-account"
              :rules="usernameRules"
              type="text"
            ></v-text-field>

            <v-text-field
              v-model="password"
              id="password"
              label="Password"
              name="password"
              prepend-icon="mdi-lock"
              :rules="passwordRules"
              type="password"
            ></v-text-field>
            <v-snackbar v-model="loginError" :timeout="timeout">
              {{ errorText }}
              <template v-slot:action="{ attrs }">
                <v-btn
                  color="teal accent-4"
                  text
                  v-bind="attrs"
                  @click="loginError = false"
                >
                  Close
                </v-btn>
              </template>
            </v-snackbar>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!valid || loading"
            v-on:click="signIn"
            class="mr-3 mb-3"
            color="light-green darken-3"
            dark
            >Login</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import axios, { AxiosResponse } from "axios";

const backendURI = process.env.BACKEND_URI || "http://localhost:18081";

@Component({
  name: "LoginForm",
  data: function() {
    return {
      valid: true,
      loading: false,
      username: "",
      usernameRules: [(v: string) => !!v || "Username is required"],
      password: "",
      passwordRules: [(v: string) => !!v || "Password is required"],

      loginError: false,
      errorText: "invalid username or password",
      timeout: 2000
    };
  },
  methods: {
    // TODO: fix signIn with proper function signature..
    signIn: async function(event: Event) {
      console.log(this.$data.username, this.$data.password);
      const data = {
        username: this.$data.username,
        password: this.$data.password,
      };
      axios
        .post(`${backendURI}/users/auth/login`)
        .then((res: AxiosResponse<any>) => {
          if (res.data.includes("invalid")) {
            this.$data.loginError = true;
          }
        })
        //FIXME : what if on error?
        .catch((err: any) => console.log(err))
        .finally(() => {
          this.$data.loading = false;
        });
    },
  },
})
export default class Home extends Vue {}
</script>

<style scoped>
#no-background-hover::before {
  background-color: transparent !important;
}
#error-msg {
  color: red;
}
</style>
