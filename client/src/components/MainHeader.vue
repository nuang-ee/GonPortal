<template>
  <div id="main-header">
    <v-toolbar color="grey lighten-4" light>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          :src="require('../assets/logo.svg')"
          transition="scale-transition"
          width="40"
          @click="$router.push('/')"
          style="cursor:pointer"
        />
        <v-toolbar-title
          @click="$router.push('/')"
          class="display-1"
          style="cursor:pointer"
        >
          <span class="font-weight-bold">GoN</span>
        </v-toolbar-title>
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

      <!-- <v-btn href="/" text>
        <span class="mr-2">Home</span>
      </v-btn> -->

      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        class="hidden-md-and-up"
      ></v-app-bar-nav-icon>
      <v-toolbar-items class="hidden-sm-and-down" v-if="loggedIn">
        <v-btn href="/profile" text>
          <span class="mr-2">Profile</span>
        </v-btn>
        <v-btn href="/logout" text>
          <span class="mr-2">Logout</span>
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-items class="hidden-sm-and-down" v-else align-center>
        <v-btn text>
          <login-form />
        </v-btn>
        <v-btn href="/register" text>
          <span class="mr-2">Register</span>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-navigation-drawer
      class="grey darken-2"
      v-model="drawer"
      right
      width="200"
      temporary
      absolute
      dark
    >
      <v-list v-if="loggedIn">
        <v-list-item
          @click="$router({ path: menuForAuthed.route })"
          v-for="item in menuForAuthed"
          :key="item.title"
          link
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list v-else>
        <v-list-item
          @click="$router({ path: menuForNotAuthed.route })"
          v-for="item in menuForNotAuthed"
          :key="item.title"
          link
        >
          <v-list-item-content>
            <v-list-item-title>{{
              item.title
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <!-- 
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block>Logout</v-btn>
        </div>
      </template> -->
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import LoginForm from "./LoginForm.vue";
import RegisterForm from "./RegisterForm.vue";
@Component({
  name: "MainHeader",
  components: {
    LoginForm,
  },
  data: () => {
    return {
      loggedIn: false,
      drawer: null,
      menuForAuthed: [
        { title: "Profile", route: "/profile" },
        { title: "Logout", route: "/logout" },
        { title: "Challenges", route: "/challenges" },
        { title: "resume", route: "/resume" },
      ],
      menuForNotAuthed: [
        { title: "Login", route: "/login" },
        { title: "Register", route: "/register" },
      ],
    };
  },
})
export default class MainHeader extends Vue {}
</script>

<style scoped>
#title-text {
  /* font-family: "Maven Pro" !important; */
  font-weight: bolder;
  font-size: 35px;
  letter-spacing: -2px;
}
</style>
