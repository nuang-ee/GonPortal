<template>
  <div id="main-header">
    <v-app-bar app color="grey darken-1" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          :src="require('../assets/logo.svg')"
          transition="scale-transition"
          width="40"
        />
        <div id="title-text">KAIST GoN</div>
        <!-- 
        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        /> -->
      </div>

      <v-spacer></v-spacer>

      <v-btn href="/" text>
        <span class="mr-2">Home</span>
      </v-btn>

    <template v-if="loggedIn">
      <v-btn href="/profile" text>
        <span class="mr-2">Profile</span>
      </v-btn>
      <v-btn href="/auth/logout" text>
        <span class="mr-2">Logout</span>
      </v-btn>
    </template>

    <template v-else>
      
     <login-form/>
      <v-btn href="/auth/register" text>
        <span class="mr-2">Register</span>
      </v-btn>
    </template>
    </v-app-bar>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import Component from "vue-class-component";
import LoginForm from "./LoginForm.vue";
import RegisterForm from "./RegisterForm.vue";
@Component({
  name: "Home",
  components: {
      LoginForm,
  },
  data: () => {
    return {
        loggedIn: false
    };
  }
})
export default class MainHeader extends Vue {}
</script>

<style scoped>
#title-text {
  font-family: "Maven Pro" !important;
  font-size: 24pt;
  font-weight: bold;
}
</style>
