<template>
  <div id="app">
    <v-app>
      <main-header />

      <v-main>
        <router-view></router-view>

      </v-main>
    </v-app>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import MainHeader from "./components/MainHeader.vue";
import Home from "./views/Home.vue";
import LoginForm from "./components/LoginForm.vue"

@Component({
  name: "App",
  components: {
    MainHeader,
    LoginForm
  },
  data: () => ({
    //
  })
})
export default class App extends Vue {};
</script>
