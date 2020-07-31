<template>
  <div id="login-form">
    <v-dialog v-model="dialog" max-width="400">
      <template v-slot:activator="{ on, attrs }">
        <v-btn :ripple=false id="no-background-hover" light v-bind="attrs" v-on="on" text>
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
            <v-form>
              <v-text-field
                class="mt-6"
                label="Login"
                name="login"
                prepend-icon="mdi-account"
                type="text"
              ></v-text-field>

              <v-text-field
                id="password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="mr-3 mb-3" color="light-green darken-3" dark>Login</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
export default {
    name: "LoginForm"
};
</script>

<style scoped>
#no-background-hover::before {
   background-color: transparent !important;
}
</style>
