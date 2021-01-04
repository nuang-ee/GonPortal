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
          style="cursor: pointer"
        />
        <v-toolbar-title
          @click="$router.push('/')"
          class="display-1"
          style="cursor: pointer"
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
        <v-btn href="/" text>
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
        <v-list-item v-for="item in menuForAuthed" :key="item.title">
          <v-list-item-content>
            <v-list-item-title>
              <v-btn :href="item.route" v-on:click="item.handler" text>
                <span class="mr-2">{{ item.title }}</span>
              </v-btn></v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list v-else>
        <v-list-item v-for="item in menuForNotAuthed" :key="item.title">
          <v-list-item-content>
            <v-list-item-title>
              <v-btn :href="item.route" text>
                <span class="mr-2">{{ item.title }}</span>
              </v-btn>
            </v-list-item-title>
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
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
})
export default class MainHeader extends Vue {
  drawer = null;
  menuForAuthed = [
    { title: "Profile", route: "/profile", handler: this.dummy },
    { title: "Logout", route: "/", handler: this.handleLogout },
    { title: "Challenges", route: "/challenges", handler: this.dummy },
    { title: "resume", route: "/resume", handler: this.dummy },
  ];
  menuForNotAuthed = [
    { title: "Login", route: "/login" },
    { title: "Register", route: "/register" },
  ];

  dummy(): boolean {
    return false;
  }
  // component methods.
  async handleLogout(): Promise<void> {
    await this.$store.dispatch("auth/logout", this.$data.user);
    alert("Successfully logged out");
  }
}
</script>

<style scoped>
#title-text {
  /* font-family: "Maven Pro" !important; */
  font-weight: bolder;
  font-size: 35px;
  letter-spacing: -2px;
}
</style>
