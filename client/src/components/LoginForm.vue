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
              v-model="user.username"
              class="mt-6"
              label="Username"
              name="username"
              prepend-icon="mdi-account"
              :rules="usernameRules"
              type="text"
            ></v-text-field>

            <v-text-field
              v-model="user.password"
              id="password"
              label="Password"
              name="password"
              prepend-icon="mdi-lock"
              :rules="passwordRules"
              type="password"
            ></v-text-field>
            <v-snackbar v-model="viewLoginStatus" :timeout="timeout">
              {{ resultMessage }}
              <template v-slot:action="{ attrs }">
                <v-btn
                  color="teal accent-4"
                  text
                  v-bind="attrs"
                  @click="viewLoginStatus = false"
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

import User from "../models/user";

//FIXME : process.env backend_uri is not working.
const backendURI = process.env.VUE_APP_BACKEND_URI || "http://localhost:18081";

@Component({})
export default class Home extends Vue {
  // Rules
  requiredRule = (val: string) => val?.length || "This field is required";

  // Data
  valid = true;
  loading = false;
  user: User = new User();
  usernameRules: Array<Function> = [ this.requiredRule ];
  passwordRules: Array<Function> = [ this.requiredRule ];

  viewLoginStatus = false;
  resultMessage = "";
  timeout = 2000;

  // component methods.
  async handleLogin() {
    this.loading = true;
    if (this.user.username && this.user.password) {
      try {
        const registerResult = await this.$store.dispatch("auth/login", this.$data.user);
        if (registerResult) {
          this.loading = false;
          alert("login success");
          this.$router.push("/home");
        }
      } catch (e) {
        (error) => {
          this.loading = false;
          this.viewLoginStatus = true;
          this.resultMessage = "invalid username or password";
        };
      }
    }
  }

  // Computed properties.
  get loggedIn() {
    return this.$store.state.auth.status.loggedIn;
  }

  // Lifecycle Hooks.
  created() {
    if (this.loggedIn) {
      this.$router.push("/home");
    }
  }
}
</script>

<style scoped>
#no-background-hover::before {
  background-color: transparent !important;
}
#error-msg {
  color: red;
}
</style>
