<template>
  <v-row justify="center">
    <v-card class="mt-4">
      <v-toolbar color="teal lighten-3" dark flat>
        <v-toolbar-title>Register</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-container>
          <small>all fields are required.</small>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.username"
                color="teal lighten-2"
                label="Username*"
                hint="로그인 시 이용됩니다."
                :rules="rules.username"
                persistent-hint
                required
              >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.password"
                color="teal lighten-2"
                label="Password*"
                type="password"
                :rules="rules.password"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="form.name"
                color="teal lighten-2"
                label="이름*"
                :rules="rules.text"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="form.sNum"
                color="teal lighten-2"
                label="학번*"
                hint="ex) 20151684"
                :rules="rules.num"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                v-model="form.semester"
                color="teal lighten-2"
                label="재학 학기*"
                hint="ex) 현재 3학기째 재학중 -> '3'"
                persistent-hint
                :items="items"
                :rules="rules.text"
                required
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.email"
                color="teal lighten-2"
                label="Email*"
                hint="카이스트 구성원 인증을 위하여 카이스트 메일이어야 합니다."
                persistent-hint
                :rules="rules.text"
                required
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="mb-1 mr-3"
          color="teal accent-4"
          text
          @click="dialog = false"
          >Register</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
@Component ({
  name: "Register",
  data: () => {
    const defaultForm = Object.freeze({
      username: "",
      password: "",
      name: "",
      sNum: "",
      semester: "",
      email: "",
    });

    return {
      items: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      form: Object.assign({}, defaultForm),
      rules: {
        num: [
          (val: string) => (val || "").length > 0 || "This field is required",
          (val: string) => (!isNaN(Number(val))) || "Student number should only contain numbers",
        ],
        text: [
          (val: string) => (val || "").length > 0 || "This field is required",
        ],
        username: [
            (val: string) => (val || "").length > 0 || "This field is required",
            (val: string) => (val && val.length >= 4 && val.length <= 20) || "Username should be 4 to 20 characters long." 
        ],
        password: [
            (val: string) => (val || "").length > 0 || "This field is required",
            (val: string) => (val && val.length >= 8 && val.length <= 20) || "password should be 8 to 20 characters long." 
        ]
      },
      conditions: false,
      snackbar: false,
      terms: false,
      defaultForm,
    };
  },

  computed: {
    formIsValid() {
      return (
        this.$data.form.username &&
        this.$data.form.password &&
        this.$data.form.name &&
        this.$data.form.sNum &&
        this.$data.form.semester &&
        this.$data.form.email
      );
    },
  }
})
export default class Register extends Vue {}
</script>

<style scoped></style>
